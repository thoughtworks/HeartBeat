package heartbeat.exception;

import lombok.Getter;

@Getter
public class UnauthorizedException extends RuntimeException {

	private final int status = 401;

	public UnauthorizedException(String message) {
		super(message);
	}

}
