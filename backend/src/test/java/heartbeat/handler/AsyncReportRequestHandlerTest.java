package heartbeat.handler;

import heartbeat.controller.report.dto.response.ReportResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AsyncReportRequestHandlerTest {

	@InjectMocks
	AsyncReportRequestHandler asyncReportRequestHandler;

	@Test
	void shouldDeleteExpireReport() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String expireTime = Long.toString(currentTimeMillis - 1900000L);
		asyncReportRequestHandler.putReport(currentTime, ReportResponse.builder().build());
		asyncReportRequestHandler.putReport(expireTime, ReportResponse.builder().build());

		asyncReportRequestHandler.deleteExpireReport(currentTimeMillis);

		assertNull(asyncReportRequestHandler.getReport(expireTime));
		assertNotNull(asyncReportRequestHandler.getReport(currentTime));
	}

	@Test
	void shouldPutAndGetAsyncReport() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		asyncReportRequestHandler.putReport(currentTime, ReportResponse.builder().build());

		assertNotNull(asyncReportRequestHandler.getReport(currentTime));
		assertNull(asyncReportRequestHandler.getReport(currentTime));
	}

	@Test
	void shouldReturnTrueOrFalseWhenExistAsyncReportOrNot() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		asyncReportRequestHandler.putReport(currentTime, ReportResponse.builder().build());

		assertTrue(asyncReportRequestHandler.isReportExists(currentTime));
		assertNotNull(asyncReportRequestHandler.getReport(currentTime));
		assertFalse(asyncReportRequestHandler.isReportExists(currentTime));
	}

}
