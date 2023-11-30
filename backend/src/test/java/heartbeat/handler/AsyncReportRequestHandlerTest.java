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
		asyncReportRequestHandler.put(currentTime, ReportResponse.builder().build());
		asyncReportRequestHandler.put(expireTime, ReportResponse.builder().build());

		asyncReportRequestHandler.deleteExpireReport(currentTimeMillis);

		assertNull(asyncReportRequestHandler.get(expireTime));
		assertNotNull(asyncReportRequestHandler.get(currentTime));
	}

	@Test
	void shouldPutAndGetAsyncReport() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		asyncReportRequestHandler.put(currentTime, ReportResponse.builder().build());

		assertNotNull(asyncReportRequestHandler.get(currentTime));
		assertNull(asyncReportRequestHandler.get(currentTime));
	}

	@Test
	void shouldReturnTrueOrFalseWhenExistAsyncReportOrNot() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		asyncReportRequestHandler.put(currentTime, ReportResponse.builder().build());

		assertTrue(asyncReportRequestHandler.isReportIsExists(currentTime));
		assertNotNull(asyncReportRequestHandler.get(currentTime));
		assertFalse(asyncReportRequestHandler.isReportIsExists(currentTime));
	}

}
