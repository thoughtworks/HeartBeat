package heartbeat.exception;

import lombok.Getter;

@Getter
public class NoContentException extends RuntimeException {

	private final int status = 204;

	public NoContentException(String message) {
		super(message);
	}

}
