package heartbeat.handler;

import heartbeat.exception.BaseException;
import heartbeat.exception.UnauthorizedException;
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
		asyncExceptionHandler.put(currentTime, new UnauthorizedException(""));
		asyncExceptionHandler.put(expireTime, new UnauthorizedException(""));

		asyncExceptionHandler.deleteExpireException(currentTimeMillis);

		assertNull(asyncExceptionHandler.get(expireTime));
		assertNotNull(asyncExceptionHandler.get(currentTime));
	}

	@Test
	void shouldPutAndGetAsyncException() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		asyncExceptionHandler.put(currentTime, new UnauthorizedException("test"));

		BaseException baseException = asyncExceptionHandler.get(currentTime);
		assertEquals(401, baseException.getStatus());
		assertEquals("test", baseException.getMessage());

		assertNull(asyncExceptionHandler.get(currentTime));
	}

}
