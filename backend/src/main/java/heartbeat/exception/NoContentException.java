package heartbeat.exception;

import lombok.Getter;

@Getter
public class NoContentException extends BaseException {

	public NoContentException(String message) {
		super(message, 204);
	}

}
