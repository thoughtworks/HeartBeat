package heartbeat.decoder;

import feign.FeignException;
import feign.Response;
import feign.codec.ErrorDecoder;
import heartbeat.exception.RateLimitExceededException;
import heartbeat.util.ExceptionUtil;
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
		if (statusCode == HttpStatus.FORBIDDEN) {
			return new RateLimitExceededException(errorMessage);
		}
		else {
			return ExceptionUtil.handleCommonFeignClientException(statusCode, errorMessage);
		}

	}

}
