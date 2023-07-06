package heartbeat.exception;

import lombok.Getter;

@Getter
@SuppressWarnings("PMD.MissingSerialVersionUID")
public class RequestFailedException extends RuntimeException {

	private final int status;

	public RequestFailedException(int statusCode, String message) {
		super(String.format("Request failed with status statusCode %d, error: %s", statusCode, message));
		this.status = statusCode;
	}

}
