package heartbeat.util;

import heartbeat.controller.report.dto.response.ReportResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AsyncReportRequestHandlerTest {

	@Test
	void shouldDeleteExpireReport() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String expireTime = Long.toString(currentTimeMillis - 1900000L);
		AsyncReportRequestHandler.put(currentTime, ReportResponse.builder().build());
		AsyncReportRequestHandler.put(expireTime, ReportResponse.builder().build());

		AsyncReportRequestHandler.deleteExpireReport(currentTimeMillis);

		assertNull(AsyncReportRequestHandler.get(expireTime));
		assertNotNull(AsyncReportRequestHandler.get(currentTime));
	}

}
