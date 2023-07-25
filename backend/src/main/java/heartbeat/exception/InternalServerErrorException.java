package heartbeat.exception;

import lombok.Getter;

@Getter
public class InternalServerErrorException extends BaseException {

	public InternalServerErrorException(String message) {
		super(message, 500);
	}

}
