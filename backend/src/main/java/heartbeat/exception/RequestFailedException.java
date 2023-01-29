package heartbeat.exception;

public class RequestFailedException extends RuntimeException {
	public RequestFailedException() {
		super("msg:Request failed with status code 400");
	}
}
