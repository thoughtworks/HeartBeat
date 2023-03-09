package heartbeat.exception;

import feign.FeignException;

public class CustomFeignClientException extends FeignException {

	public CustomFeignClientException(int status, String message) {
		super(status, message);
	}

}
