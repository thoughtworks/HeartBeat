package heartbeat.exception;

import lombok.Getter;

@Getter
public class BadRequestException extends BaseException {

	public BadRequestException(String message) {
		super(message, 400);
	}

}
