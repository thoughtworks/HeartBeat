package heartbeat.client.decoder;

import feign.Response;
import feign.codec.ErrorDecoder;
import heartbeat.util.ExceptionUtil;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;

@Log4j2
public class BuildKiteFeignClientDecoder implements ErrorDecoder {

	@Override
	public Exception decode(String methodKey, Response response) {
		String errorMessage = switch (methodKey) {
			case "getTokenInfo" -> "Failed to get token info";
			case "getBuildKiteOrganizationsInfo" -> "Failed to get BuildKite OrganizationsInfo info";
			case "getPipelineInfo" -> "Failed to get pipeline info";
			case "getPipelineSteps" -> "Failed to get pipeline steps";
			case "getPipelineStepsInfo" -> "Failed to get pipeline steps info";
			default -> "Failed to get buildkite info";
		};

		log.error("Failed to get BuildKite info_response status: {}, method key: {}", response.status(), methodKey);
		HttpStatus statusCode = HttpStatus.valueOf(response.status());
		return ExceptionUtil.handleCommonFeignClientException(statusCode, errorMessage);
	}

}
