package heartbeat.exception;

public class DecryptDataOrPasswordWrongException extends BaseException {

	public DecryptDataOrPasswordWrongException(String message, int statusCode) {
		super(message, statusCode);
	}

}
