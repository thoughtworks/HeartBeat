package heartbeat.exception;

import lombok.Getter;

@Getter
public class ServiceUnavailableException extends BaseException {

	public ServiceUnavailableException(String message) {
		super(message, 503);
	}

}
