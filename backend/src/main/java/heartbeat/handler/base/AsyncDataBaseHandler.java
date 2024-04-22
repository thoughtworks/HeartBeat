package heartbeat.handler.base;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;
import heartbeat.exception.GenerateReportException;
import lombok.extern.log4j.Log4j2;
import org.springframework.util.ObjectUtils;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.Optional;

import static heartbeat.service.report.scheduler.DeleteExpireCSVScheduler.EXPORT_CSV_VALIDITY_TIME;

@Log4j2
public class AsyncDataBaseHandler {

	private static final String OUTPUT_FILE_PATH = "./app/output/";

	public static final String SUFFIX_TMP = ".tmp";

	public static final String SUFFIX_LOCK = ".lock";

	public static final String FILENAME_SPLIT_PATTERN = "[-.]";

	protected synchronized void createFileByType(FIleType fIleType, String fileId, String json) {
		createDirToConvertData(fIleType);
		String fileName = OUTPUT_FILE_PATH + fIleType.getPath() + fileId;
		String tmpFileName = OUTPUT_FILE_PATH + fIleType.getPath() + fileId + SUFFIX_TMP;
		if (!fileName.contains("..") && fileName.startsWith(OUTPUT_FILE_PATH + fIleType.getPath())
				&& tmpFileName.startsWith(OUTPUT_FILE_PATH + fIleType.getPath())) {
			log.info("Start to write file type: {}, file name: {}", fIleType.getType(), fileName);
			try (FileWriter writer = new FileWriter(tmpFileName)) {
				writer.write(json);
				Files.move(Path.of(tmpFileName), Path.of(fileName), StandardCopyOption.ATOMIC_MOVE);
				log.info("Successfully write file type: {}, file name: {}", fIleType.getType(), fileId);
			}
			catch (IOException | RuntimeException e) {
				log.error("Failed write file type: {}, file name: {}, reason: {}", fIleType.getType(), fileId, e);
				throw new GenerateReportException("Failed write " + fIleType.getType() + " " + fileId);
			}
		}
		else {
			throw new GenerateReportException(
					"Failed write file " + fIleType.getType() + " " + fileId + "invalid filename");
		}
	}

	private void createDirToConvertData(FIleType fIleType) {
		File directory = new File(OUTPUT_FILE_PATH + fIleType.getType());
		boolean isCreateSucceed = directory.mkdirs();
		String message = isCreateSucceed ? String.format("Successfully create %s directory", fIleType.getType())
				: String.format("Failed create %s directory because it already exist", fIleType.getType());
		log.info(message);
	}

	public <T> T readFileByType(File file, FIleType fIleType, String fileId, Class<T> classType) {
		if (file.toPath().normalize().startsWith(new File(OUTPUT_FILE_PATH).toPath().normalize())) {
			if (file.exists()) {
				try (JsonReader reader = new JsonReader(new FileReader(file))) {
					return new Gson().fromJson(reader, classType);
				}
				catch (IOException | RuntimeException e) {
					log.error("Failed read file type: {}, file name: {}, reason: {}", fIleType.getType(), fileId, e);
					throw new GenerateReportException("Failed read file " + fIleType.getType() + " " + fileId);
				}
			}
		}
		else {
			throw new GenerateReportException(
					"Failed read file " + fIleType.getType() + " " + fileId + "invalid filename");
		}
		return null;
	}

	protected <T> T readAndRemoveFileByType(FIleType fIleType, String fileId, Class<T> classType) {
		String fileName = OUTPUT_FILE_PATH + fIleType.getPath() + fileId;
		if (!fileName.contains("..") && fileName.startsWith(OUTPUT_FILE_PATH + fIleType.getPath())) {
			log.info("Start to remove file type: {}, file name: {}", fIleType.getType(), fileId);
			try {
				T t = readFileByType(new File(fileName), fIleType, fileId, classType);
				if (Objects.nonNull(t)) {
					Files.delete(Path.of(fileName));
				}
				log.info("Successfully remove file type: {}, file name: {}", fIleType.getType(), fileId);
				return t;
			}
			catch (IOException | RuntimeException e) {
				log.info("Failed remove file type: {}, file name: {}", fIleType.getType(), fileId);
				throw new GenerateReportException("Failed remove " + fIleType.getType() + " file with file:" + fileId);
			}
		}
		else {
			throw new GenerateReportException(
					"Failed read and remove " + fIleType.getType() + " file with file name :" + fileId);
		}
	}

	protected void deleteExpireFileByType(FIleType fIleType, long currentTimeStamp, File directory) {
		try {
			deleteOldFiles(fIleType, currentTimeStamp, directory);
		}
		catch (Exception e) {
			Throwable cause = Optional.ofNullable(e.getCause()).orElse(e);
			log.error("Failed to deleted expired {} files, currentTimeStamp：{}, exception: {}", fIleType.getType(),
					currentTimeStamp, cause.getMessage());
		}
	}

	public void acquireLock(FIleType fIleType, String fileId) {
		String fileName = OUTPUT_FILE_PATH + fIleType.getPath() + fileId + SUFFIX_LOCK;
		if (!fileName.contains("..") && fileName.startsWith(OUTPUT_FILE_PATH + fIleType.getPath())) {
			File file = new File(fileName);
			if (!file.getParentFile().exists()) {
				file.getParentFile().mkdirs();
			}
			while (!tryLock(file)) {
			}
		}
		else {
			throw new GenerateReportException("Failed locked " + fIleType.getType() + " lock :" + fileId);
		}
	}

	public boolean tryLock(File file) {
		try {
			return file.createNewFile();
		}
		catch (IOException e) {
			return false;
		}
	}

	protected void unLock(FIleType fIleType, String fileId) {
		String fileName = OUTPUT_FILE_PATH + fIleType.getPath() + fileId + SUFFIX_LOCK;
		if (!fileName.contains("..") && fileName.startsWith(OUTPUT_FILE_PATH + fIleType.getPath())) {
			File lockFile = new File(fileName);
			if (lockFile.exists()) {
				lockFile.delete();
			}
		}
		else {
			throw new GenerateReportException("Failed unlocked " + fIleType.getType() + " lock :" + fileId);
		}
	}

	private void deleteOldFiles(FIleType fIleType, long currentTimeStamp, File directory) {
		File[] files = directory.listFiles();
		if (!ObjectUtils.isEmpty(files)) {
			for (File file : files) {
				String fileName = file.getName();
				String[] splitResult = fileName.split(FILENAME_SPLIT_PATTERN);
				String timeStamp = splitResult[1];
				if (validateExpire(currentTimeStamp, Long.parseLong(timeStamp)) && !file.delete() && file.exists()) {
					log.error("Failed to deleted expired fIleType: {} file, file name: {}", fIleType.getType(),
							fileName);
				}
			}
		}
	}

	private boolean validateExpire(long currentTimeStamp, long timeStamp) {
		return timeStamp < currentTimeStamp - EXPORT_CSV_VALIDITY_TIME;
	}

}
