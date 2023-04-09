package heartbeat.exception;

import lombok.Getter;

@Getter
public class PermissionDenyException extends RequestFailedException {

	private final int status;

	public PermissionDenyException(int status, String message) {
		super(status, message);
		this.status = status;
	}

}
