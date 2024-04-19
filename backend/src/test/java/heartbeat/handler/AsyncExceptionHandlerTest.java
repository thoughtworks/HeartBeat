package heartbeat.handler;

import heartbeat.exception.GenerateReportException;
import heartbeat.exception.UnauthorizedException;
import heartbeat.handler.base.AsyncExceptionDTO;
import heartbeat.util.IdUtil;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.CyclicBarrier;

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AsyncExceptionHandlerTest {

	public static final String APP_OUTPUT_ERROR = "./app/output/error";

	@InjectMocks
	AsyncExceptionHandler asyncExceptionHandler;

	@AfterEach
	void afterEach() {
		new File(APP_OUTPUT_ERROR).delete();
	}

	@AfterAll
	static void afterAll() {
		try {
			FileUtils.cleanDirectory(new File("./app"));
		}
		catch (IOException ignored) {
		}
	}

	@Test
	void shouldDeleteAsyncException() {
		long fileId = System.currentTimeMillis();
		String currentTime = Long.toString(fileId);
		String expireTime = Long.toString(fileId - 1900000L);
		String unExpireFile = IdUtil.getBoardReportFileId(currentTime);
		String expireFile = IdUtil.getBoardReportFileId(expireTime);
		asyncExceptionHandler.put(unExpireFile, new UnauthorizedException(""));
		asyncExceptionHandler.put(expireFile, new UnauthorizedException(""));

		asyncExceptionHandler.deleteExpireExceptionFile(fileId, new File(APP_OUTPUT_ERROR));

		assertNull(asyncExceptionHandler.get(expireFile));
		assertNotNull(asyncExceptionHandler.get(unExpireFile));
		deleteTestFile(unExpireFile);
		assertNull(asyncExceptionHandler.get(unExpireFile));
	}

	@Test
	void shouldDeleteAsyncExceptionTmpFile() {
		long fileId = System.currentTimeMillis();
		String currentTime = Long.toString(fileId);
		String expireTime = Long.toString(fileId - 1900000L);
		String unExpireFile = IdUtil.getBoardReportFileId(currentTime) + ".tmp";
		String expireFile = IdUtil.getBoardReportFileId(expireTime) + ".tmp";
		asyncExceptionHandler.put(unExpireFile, new UnauthorizedException(""));
		asyncExceptionHandler.put(expireFile, new UnauthorizedException(""));

		asyncExceptionHandler.deleteExpireExceptionFile(fileId, new File(APP_OUTPUT_ERROR));

		assertNull(asyncExceptionHandler.get(expireFile));
		assertNotNull(asyncExceptionHandler.get(unExpireFile));
		deleteTestFile(unExpireFile);
		assertNull(asyncExceptionHandler.get(unExpireFile));
	}

	@Test
	void shouldSafeDeleteAsyncExceptionWhenHaveManyThordToDeleteFile() throws InterruptedException {
		long fileId = System.currentTimeMillis();
		String currentTime = Long.toString(fileId);
		String expireTime = Long.toString(fileId - 1900000L);
		String unExpireFile = IdUtil.getBoardReportFileId(currentTime);
		String expireFile = IdUtil.getBoardReportFileId(expireTime);
		asyncExceptionHandler.put(unExpireFile, new UnauthorizedException(""));
		asyncExceptionHandler.put(expireFile, new UnauthorizedException(""));
		CyclicBarrier barrier = new CyclicBarrier(3);
		Runnable runnable = () -> {
			try {
				barrier.await();
				asyncExceptionHandler.deleteExpireExceptionFile(fileId, new File(APP_OUTPUT_ERROR));
			}
			catch (Exception ignored) {
			}
		};
		Thread thread = new Thread(runnable);
		Thread thread1 = new Thread(runnable);
		Thread thread2 = new Thread(runnable);
		thread.start();
		thread1.start();
		thread2.start();
		thread.join();
		thread1.join();
		thread2.join();

		assertNull(asyncExceptionHandler.get(expireFile));
		assertNotNull(asyncExceptionHandler.get(unExpireFile));
		deleteTestFile(unExpireFile);
		assertNull(asyncExceptionHandler.get(unExpireFile));
	}

	@Test
	void shouldPutAndGetAsyncException() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String boardReportId = IdUtil.getBoardReportFileId(currentTime);
		asyncExceptionHandler.put(boardReportId, new UnauthorizedException("test"));

		var baseException = asyncExceptionHandler.get(boardReportId);

		assertEquals(HttpStatus.UNAUTHORIZED.value(), baseException.getStatus());
		assertEquals("test", baseException.getMessage());
		deleteTestFile(boardReportId);
		assertNull(asyncExceptionHandler.get(boardReportId));
	}

	@Test
	void shouldThrowExceptionGivenCantWriteFileWhenPutFile() {
		String boardReportId = "15469:890/33";

		assertThrows(GenerateReportException.class,
				() -> asyncExceptionHandler.put(boardReportId, new UnauthorizedException("test")));
	}

	@Test
	void shouldThrowExceptionGivenCannotReadFileWhenGetFile() throws IOException {
		new File("./app/output/error/").mkdirs();
		String boardReportId = IdUtil.getBoardReportFileId(Long.toString(System.currentTimeMillis()));
		Path filePath = Paths.get("./app/output/error/" + boardReportId);
		Files.createFile(filePath);
		Files.write(filePath, "test".getBytes());

		assertThrows(GenerateReportException.class, () -> asyncExceptionHandler.get(boardReportId));

		Files.deleteIfExists(filePath);
		assertNull(asyncExceptionHandler.get(boardReportId));
	}

	@Test
	void shouldCreateTargetDirWhenPutAsyncException() {
		boolean mkdirs = new File(APP_OUTPUT_ERROR).mkdirs();
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String boardReportId = IdUtil.getBoardReportFileId(currentTime);

		asyncExceptionHandler.put(boardReportId, new UnauthorizedException("test"));

		assertTrue(mkdirs);
		assertTrue(Files.exists(Path.of(APP_OUTPUT_ERROR)));
		deleteTestFile(boardReportId);
		assertNull(asyncExceptionHandler.get(boardReportId));
	}

	@Test
	void shouldPutAndRemoveAsyncException() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String boardReportId = IdUtil.getBoardReportFileId(currentTime);
		asyncExceptionHandler.put(boardReportId, new UnauthorizedException("test"));

		AsyncExceptionDTO baseException = asyncExceptionHandler.remove(boardReportId);

		assertEquals(HttpStatus.UNAUTHORIZED.value(), baseException.getStatus());
		assertEquals("test", baseException.getMessage());
		assertNull(asyncExceptionHandler.get(currentTime));
	}

	@Test
	void shouldReturnExceptionGivenWrongFileWhenReadAndRemoveAsyncException() throws IOException {
		new File("./app/output/error/").mkdirs();
		String boardReportId = IdUtil.getBoardReportFileId(Long.toString(System.currentTimeMillis()));
		Path filePath = Paths.get("./app/output/error/" + boardReportId);
		Files.createFile(filePath);
		Files.write(filePath, "test".getBytes());

		assertThrows(GenerateReportException.class, () -> asyncExceptionHandler.remove(boardReportId));

		Files.deleteIfExists(filePath);
		assertNull(asyncExceptionHandler.get(boardReportId));
	}

	@Test
	void shouldThrowExceptionWhenDeleteFile() {
		File mockFile = mock(File.class);
		when(mockFile.getName()).thenReturn("board-1683734399999");
		when(mockFile.delete()).thenThrow(new RuntimeException("test"));
		File[] mockFiles = new File[] { mockFile };
		File directory = mock(File.class);
		when(directory.listFiles()).thenReturn(mockFiles);

		assertDoesNotThrow(
				() -> asyncExceptionHandler.deleteExpireExceptionFile(System.currentTimeMillis(), directory));
	}

	@Test
	void shouldDeleteFailWhenDeleteFile() {
		File mockFile = mock(File.class);
		when(mockFile.getName()).thenReturn("board-1683734399999");
		when(mockFile.delete()).thenReturn(false);
		when(mockFile.exists()).thenReturn(true);
		File[] mockFiles = new File[] { mockFile };
		File directory = mock(File.class);
		when(directory.listFiles()).thenReturn(mockFiles);

		assertDoesNotThrow(
				() -> asyncExceptionHandler.deleteExpireExceptionFile(System.currentTimeMillis(), directory));
	}

	@Test
	void shouldThrowGenerateReportExceptionGivenFileNameInvalidWhenHandlerRemoveData() {
		assertThrows(GenerateReportException.class, () -> asyncExceptionHandler.remove("../"));
	}

	private void deleteTestFile(String reportId) {
		asyncExceptionHandler.remove(reportId);
	}

}
