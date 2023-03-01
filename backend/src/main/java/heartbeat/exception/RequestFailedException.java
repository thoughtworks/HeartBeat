package heartbeat.exception;

import feign.FeignException;
import lombok.Getter;

@Getter
@SuppressWarnings("PMD.MissingSerialVersionUID")
public class RequestFailedException extends RuntimeException {

	private final int status;

	public RequestFailedException(FeignException e) {
		super(String.format("Request failed with status code %d, error: %s", e.status(), e.getMessage()));
		this.status = e.status();
	}

}
