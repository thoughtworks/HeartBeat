package heartbeat.handler.base;

import org.junit.jupiter.api.Test;

import java.io.File;

import static org.junit.jupiter.api.Assertions.assertFalse;

class AsyncDataBaseHandlerTest {

	AsyncDataBaseHandler asyncDataBaseHandler = new AsyncDataBaseHandler();

	@Test
	void shouldReturnFalseGivenCreateFileThrowExceptionWhenTryLock() {
		File file = new File("./app/output/lock");

		boolean result = asyncDataBaseHandler.tryLock(file);

		assertFalse(result);
	}

}
