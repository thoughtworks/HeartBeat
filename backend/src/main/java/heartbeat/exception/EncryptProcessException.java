package heartbeat.exception;

import org.springframework.http.HttpStatus;

public class EncryptProcessException extends BaseException {

	public EncryptProcessException(String message) {
		super(message, HttpStatus.INTERNAL_SERVER_ERROR.value());
	}

}
