package heartbeat.exception;

import lombok.Getter;

@Getter
public class PermissionDenyException extends BaseException {

	public PermissionDenyException(String message) {
		super(message, 403);
	}

}
