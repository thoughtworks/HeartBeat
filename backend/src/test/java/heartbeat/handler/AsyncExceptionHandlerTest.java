package heartbeat.handler;

import heartbeat.exception.BaseException;
import heartbeat.exception.UnauthorizedException;
import heartbeat.util.IdUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AsyncExceptionHandlerTest {

	@InjectMocks
	AsyncExceptionHandler asyncExceptionHandler;

	@Test
	void shouldDeleteAsyncException() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String expireTime = Long.toString(currentTimeMillis - 1900000L);
		String boardReportId1 = IdUtil.getBoardReportId(currentTime);
		String boardReportId2 = IdUtil.getBoardReportId(expireTime);
		asyncExceptionHandler.put(boardReportId1, new UnauthorizedException(""));
		asyncExceptionHandler.put(boardReportId2, new UnauthorizedException(""));

		asyncExceptionHandler.deleteExpireException(currentTimeMillis);

		assertNull(asyncExceptionHandler.get(boardReportId2));
		assertNotNull(asyncExceptionHandler.get(boardReportId1));
	}

	@Test
	void shouldPutAndGetAsyncException() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String boardReportId = IdUtil.getBoardReportId(currentTime);
		asyncExceptionHandler.put(boardReportId, new UnauthorizedException("test"));

		BaseException baseException = asyncExceptionHandler.get(boardReportId);
		assertEquals(401, baseException.getStatus());
		assertEquals("test", baseException.getMessage());

		assertNull(asyncExceptionHandler.get(currentTime));
	}

}
