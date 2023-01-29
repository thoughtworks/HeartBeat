package heartbeat.exception;

@SuppressWarnings("PMD.MissingSerialVersionUID")
public class RequestFailedException extends RuntimeException {

	public RequestFailedException(Exception e) {
		super("Request failed with status code 400, error: " + e.getMessage());
	}

}
