package heartbeat.util;

import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.UnauthorizedException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AsyncExceptionHandlerTest {

	@Test
	void shouldDeleteAsyncException() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String expireTime = Long.toString(currentTimeMillis - 1900000L);
		AsyncExceptionHandler.put(currentTime, new UnauthorizedException(""));
		AsyncExceptionHandler.put(expireTime, new UnauthorizedException(""));

		AsyncExceptionHandler.deleteExpireException(currentTimeMillis);

		assertNull(AsyncExceptionHandler.get(expireTime));
		assertNotNull(AsyncExceptionHandler.get(currentTime));
	}

}
