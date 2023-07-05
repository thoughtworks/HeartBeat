package heartbeat.exception;

import lombok.Getter;

@Getter
public class RateLimitExceededException extends BaseException {

	public RateLimitExceededException(String message) {
		super(message, 403);
	}

}
