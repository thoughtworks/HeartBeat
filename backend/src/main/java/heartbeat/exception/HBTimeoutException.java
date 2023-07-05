package heartbeat.exception;

import lombok.Getter;

@Getter
public class HBTimeoutException extends BaseException {

	public HBTimeoutException(String message) {
		super(message, 503);
	}

}
