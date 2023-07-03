package heartbeat.exception;

import lombok.Getter;

@Getter
public class NotFoundException extends RuntimeException {

	private final int status = 404;

	public NotFoundException(String message) {
		super(message);
	}

}
