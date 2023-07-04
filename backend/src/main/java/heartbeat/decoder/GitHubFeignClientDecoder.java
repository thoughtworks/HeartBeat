package heartbeat.decoder;

import feign.FeignException;
import feign.Response;
import feign.codec.ErrorDecoder;
import heartbeat.exception.HBTimeoutException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.RateLimitExceededException;
import heartbeat.exception.RequestFailedException;
import heartbeat.exception.UnauthorizedException;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;

@Log4j2
public class GitHubFeignClientDecoder implements ErrorDecoder {

	@Override
	public Exception decode(String methodKey, Response response) {
		log.error("[GitHubFeignClientDecoder] failed to get GitHub info_response status: {}, method key: {}",
				response.status(), methodKey);
		HttpStatus statusCode = HttpStatus.valueOf(response.status());
		FeignException exception = FeignException.errorStatus(methodKey, response);
		String errorMessage = String.format("Failed to get GitHub info_status: %s, reason: %s", statusCode,
				exception.getMessage());
		if (statusCode == HttpStatus.UNAUTHORIZED) {
			return new UnauthorizedException(errorMessage);
		}
		else if (statusCode == HttpStatus.FORBIDDEN) {
			return new RateLimitExceededException(errorMessage);
		}
		else if (statusCode == HttpStatus.NOT_FOUND) {
			return new NotFoundException(errorMessage);
		}
		else if (statusCode == HttpStatus.SERVICE_UNAVAILABLE) {
			return new HBTimeoutException(errorMessage);
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
