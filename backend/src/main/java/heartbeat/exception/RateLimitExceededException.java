package heartbeat.exception;

import lombok.Getter;

@Getter
public class RateLimitExceededException extends RuntimeException {

	private final int status = 403;

	public RateLimitExceededException(String message) {
		super(message);
	}

}
