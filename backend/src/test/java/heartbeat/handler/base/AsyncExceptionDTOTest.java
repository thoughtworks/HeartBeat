package heartbeat.handler.base;

import heartbeat.exception.BaseException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AsyncExceptionDTOTest {

	@Test
	void testAsyncExceptionDTOInheritance() {
		String expectedMessage = "Test Message";
		int expectedStatus = 404;

		BaseException baseException = new AsyncExceptionDTO(expectedMessage, expectedStatus);

		assertEquals(expectedMessage, baseException.getMessage());
		assertEquals(expectedStatus, baseException.getStatus());
	}

}
