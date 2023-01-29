package heartbeat.exception;

public class RequestFailedException extends RuntimeException {

	public RequestFailedException() {
		super("Request failed with status code 400");
	}

}
