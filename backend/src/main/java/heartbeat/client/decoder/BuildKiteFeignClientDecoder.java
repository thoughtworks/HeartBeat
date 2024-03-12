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
		String errorMessage = "";
		switch (methodKey) {
			case "getTokenInfo":
				errorMessage = "Failed to get token info";
				break;
			case "getBuildKiteOrganizationsInfo":
				errorMessage = "Failed to get BuildKite OrganizationsInfo info";
				break;
			case "getPipelineInfo":
				errorMessage = "Failed to get pipeline info";
				break;
			case "getPipelineSteps":
				errorMessage = "Failed to get pipeline steps";
				break;
			case "getPipelineStepsInfo":
				errorMessage = "Failed to get pipeline steps info";
				break;
			default:
				break;
		}

		log.error("Failed to get BuildKite info_response status: {}, method key: {}", response.status(), methodKey);
		HttpStatus statusCode = HttpStatus.valueOf(response.status());
		return ExceptionUtil.handleCommonFeignClientException(statusCode, errorMessage);
	}

}
