package heartbeat.client.decoder;

import feign.FeignException;
import feign.Response;
import feign.codec.ErrorDecoder;
import heartbeat.util.ExceptionUtil;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;

@Log4j2
public class JiraFeignClientDecoder implements ErrorDecoder {

	@Override
	public Exception decode(String methodKey, Response response) {
		log.error("Failed to get Jira info_response status: {}, method key: {}", response.status(), methodKey);
		HttpStatus statusCode = HttpStatus.valueOf(response.status());
		FeignException exception = FeignException.errorStatus(methodKey, response);
		String errorMessage = String.format("Failed to get Jira info_status: %s, reason: %s", statusCode,
				exception.getMessage());
		return ExceptionUtil.handleCommonFeignClientException(statusCode, errorMessage);
	}

}
