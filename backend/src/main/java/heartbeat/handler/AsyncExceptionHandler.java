package heartbeat.handler;

import com.google.gson.Gson;
import heartbeat.exception.BaseException;
import heartbeat.handler.base.AsyncDataBaseHandler;
import heartbeat.handler.base.AsyncExceptionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Path;

import static heartbeat.handler.base.FIleType.ERROR;

@Component
@RequiredArgsConstructor
public class AsyncExceptionHandler extends AsyncDataBaseHandler {

	private static final String OUTPUT_FILE_PATH = "./app/output/";

	private static final String SLASH = "/";

	public void put(String reportId, BaseException e) {
		createFileByType(ERROR, reportId, new Gson().toJson(new AsyncExceptionDTO(e)));
	}

	public AsyncExceptionDTO get(String reportId) {
		Path targetPath = new File(OUTPUT_FILE_PATH).toPath().normalize();
		String fileName = targetPath + SLASH + ERROR.getPath() + reportId;
		return readFileByType(new File(fileName), ERROR, reportId, AsyncExceptionDTO.class);
	}

	public AsyncExceptionDTO remove(String reportId) {
		return readAndRemoveFileByType(ERROR, reportId, AsyncExceptionDTO.class);
	}

	public void deleteExpireExceptionFile(long currentTimeStamp, File directory) {
		deleteExpireFileByType(ERROR, currentTimeStamp, directory);
	}

}
