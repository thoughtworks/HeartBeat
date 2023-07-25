package heartbeat.util;

import heartbeat.exception.ServiceUnavailableException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.RequestFailedException;
import heartbeat.exception.UnauthorizedException;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

public class ExceptionUtilTest {

	@Test
	void shouldThrowUnauthorizedExceptionWhenStatusIs401() {
		RuntimeException exception = ExceptionUtil.handleCommonFeignClientException(HttpStatus.UNAUTHORIZED, "test");

		assertEquals(UnauthorizedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("test"));

	}

	@Test
	void shouldThrowNotFoundExceptionWhenStatusIs404() {
		RuntimeException exception = ExceptionUtil.handleCommonFeignClientException(HttpStatus.NOT_FOUND, "test");

		assertEquals(NotFoundException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("test"));

	}

	@Test
	void shouldThrowTimeoutExceptionWhenStatusIs503() {
		RuntimeException exception = ExceptionUtil.handleCommonFeignClientException(HttpStatus.SERVICE_UNAVAILABLE,
				"test");

		assertEquals(ServiceUnavailableException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("test"));

	}

	@Test
	void shouldThrowExceptionWhenStatusIs4xx() {
		RuntimeException exception = ExceptionUtil.handleCommonFeignClientException(HttpStatus.NOT_ACCEPTABLE, "test");

		assertEquals(RequestFailedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("Client Error"));

	}

	@Test
	void shouldThrowExceptionWhenStatusIs5xx() {
		RuntimeException exception = ExceptionUtil.handleCommonFeignClientException(HttpStatus.NOT_IMPLEMENTED, "test");

		assertEquals(RequestFailedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("Server Error"));

	}

	@Test
	void shouldThrowExceptionWhenStatusIsError() {
		RuntimeException exception = ExceptionUtil.handleCommonFeignClientException(HttpStatus.MULTIPLE_CHOICES,
				"test");

		assertEquals(RequestFailedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("UnKnown Error"));

	}

}
