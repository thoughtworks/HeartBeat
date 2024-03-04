package heartbeat.handler.base;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AsyncExceptionDTOTest {

	@Test
	void testAsyncExceptionDTOInheritance() {
		String expectedMessage = "Test Message";
		int expectedStatus = 404;

		AsyncExceptionDTO baseException = new AsyncExceptionDTO(expectedMessage, expectedStatus);

		assertEquals(expectedMessage, baseException.getMessage());
		assertEquals(expectedStatus, baseException.getStatus());
	}

}
