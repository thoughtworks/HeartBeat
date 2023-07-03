package heartbeat.exception;

import lombok.Getter;

@Getter
public class PermissionDenyException extends RuntimeException {

	private final int status = 403;

	public PermissionDenyException(String message) {
		super(message);
	}

}
