package heartbeat.exception;

import org.springframework.http.HttpStatus;

public class EncryptDecryptProcessException extends BaseException {

	public EncryptDecryptProcessException(String message) {
		super(message, HttpStatus.INTERNAL_SERVER_ERROR.value());
	}

}
