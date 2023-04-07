package heartbeat.exception;

import javax.naming.NoPermissionException;

public class PermissionDenyException extends NoPermissionException {
	private final int status;

	public PermissionDenyException(NoPermissionException e) {
		super(String.format("Request failed with status code %d, error: %s", 403, e.getMessage()));
		this.status = 403;
	}
}
