package heartbeat.exception;

import lombok.Getter;

@Getter
public class NotFoundException extends RuntimeException {

	private final int status;

	public NotFoundException(int status, String message) {
		super(String.format("Not found with status %d, error: %s", status, message));
		this.status = status;
	}

}
