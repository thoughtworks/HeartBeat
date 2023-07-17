package heartbeat.exception;

import lombok.Getter;

@Getter
public class RequestFailedException extends BaseException {

	public RequestFailedException(int statusCode, String message) {
		super(String.format("Request failed with status statusCode %d, error: %s", statusCode, message), statusCode);
	}

}
