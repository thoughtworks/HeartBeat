package heartbeat.exception;

import lombok.Getter;

@Getter
public class RequestFailedException extends RuntimeException {

	private final int status;

	public RequestFailedException(int status) {
		super("Request failed with status code " + status);
		this.status = status;
	}

}
