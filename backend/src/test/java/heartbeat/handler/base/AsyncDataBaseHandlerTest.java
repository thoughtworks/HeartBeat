package heartbeat.handler.base;

import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.GenerateReportException;
import org.junit.jupiter.api.Test;

import java.io.File;

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertFalse;

class AsyncDataBaseHandlerTest {

	AsyncDataBaseHandler asyncDataBaseHandler = new AsyncDataBaseHandler();

	@Test
	void shouldReturnFalseGivenCreateFileThrowExceptionWhenTryLock() {
		File file = new File("./app/output/lock");

		boolean result = asyncDataBaseHandler.tryLock(file);

		assertFalse(result);
	}

	@Test
	void shouldReturnGenerateReportExceptionGivenFileNotStartWithRightFilePath() {
		File file = new File("./app/input/lock");

		assertThrows(GenerateReportException.class,
				() -> asyncDataBaseHandler.readFileByType(file, FIleType.ERROR, "111", ReportResponse.class));
	}

}
