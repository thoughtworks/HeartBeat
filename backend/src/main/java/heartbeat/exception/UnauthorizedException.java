package heartbeat.exception;

import lombok.Getter;

@Getter
public class UnauthorizedException extends BaseException {

	public UnauthorizedException(String message) {
		super(message, 401);
	}

}
