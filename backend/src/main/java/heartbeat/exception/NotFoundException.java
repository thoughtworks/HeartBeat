package heartbeat.exception;

import lombok.Getter;

@Getter
public class NotFoundException extends BaseException {

	public NotFoundException(String message) {
		super(message, 404);
	}

}
