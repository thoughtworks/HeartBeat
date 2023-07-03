package heartbeat.exception;

import lombok.Getter;

@Getter
public class BadRequestException extends RuntimeException {

	private final int status = 400;

	public BadRequestException(String message) {
		super(message);
	}

}
