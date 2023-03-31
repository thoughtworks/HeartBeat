package heartbeat.decoder;

import feign.Response;
import feign.codec.ErrorDecoder;
import heartbeat.exception.RequestFailedException;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;

@Log4j2
public class BuildKiteFeignClientDecoder implements ErrorDecoder {

	@Override
	public Exception decode(String methodKey, Response response) {
		log.error("[BuildKiteFeignClientDecoder] failed to get BuildKite info_response status: {}, method key: {}",
				response.status(), methodKey);
		HttpStatus statusCode = HttpStatus.valueOf(response.status());
		if (statusCode.is4xxClientError()) {
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
