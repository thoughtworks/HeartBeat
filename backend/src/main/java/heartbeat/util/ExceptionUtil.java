package heartbeat.util;

import heartbeat.exception.NotFoundException;
import heartbeat.exception.PermissionDenyException;
import heartbeat.exception.RequestFailedException;
import heartbeat.exception.ServiceUnavailableException;
import heartbeat.exception.UnauthorizedException;
import org.springframework.http.HttpStatus;

public interface ExceptionUtil {

	static RuntimeException handleCommonFeignClientException(HttpStatus statusCode, String errorMessage) {
		if (statusCode == HttpStatus.FORBIDDEN) {
			return new PermissionDenyException(errorMessage);
		}
		if (statusCode == HttpStatus.UNAUTHORIZED) {
			return new UnauthorizedException(errorMessage);
		}
		else if (statusCode == HttpStatus.NOT_FOUND) {
			return new NotFoundException(errorMessage);
		}
		else if (statusCode == HttpStatus.SERVICE_UNAVAILABLE) {
			return new ServiceUnavailableException(errorMessage);
		}
		else if (statusCode.is4xxClientError()) {
			return new RequestFailedException(statusCode.value(), "Client Error");
		}
		else if (statusCode.is5xxServerError()) {
			return new RequestFailedException(statusCode.value(), "Server Error");
		}
		else {
			return new RequestFailedException(statusCode.value(), "UnKnown Error");
		}
	}

}
