package heartbeat.handler.base;

import heartbeat.exception.BaseException;

public class AsyncExceptionDTO extends BaseException {

	public AsyncExceptionDTO(String message, int status) {
		super(message, status);
	}

}
