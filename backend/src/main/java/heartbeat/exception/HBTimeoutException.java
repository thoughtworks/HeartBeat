package heartbeat.exception;

import lombok.Getter;

@Getter
public class HBTimeoutException extends RuntimeException {

	private final int status = 503;

	public HBTimeoutException(String message) {
		super(message);
	}

}
