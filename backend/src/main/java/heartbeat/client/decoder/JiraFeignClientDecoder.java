package heartbeat.client.decoder;

import feign.Response;
import feign.codec.ErrorDecoder;
import heartbeat.util.ExceptionUtil;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;

@Log4j2
public class JiraFeignClientDecoder implements ErrorDecoder {

	@Override
	public Exception decode(String methodKey, Response response) {
		String errorMessage = "";
		switch (methodKey) {
			case "getJiraBoardConfiguration":
				errorMessage = "Failed to get jira board configuration";
				break;
			case "getColumnStatusCategory":
				errorMessage = "Failed to get column status category";
				break;
			case "getJiraCards":
				errorMessage = "Failed to get jira cards";
				break;
			case "getJiraCardHistoryByCount":
				errorMessage = "Failed to get jira card history by count";
				break;
			case "getTargetField":
				errorMessage = "Failed to get target field";
				break;
			case "getBoard":
				errorMessage = "Failed to get board";
				break;
			case "getProject":
				errorMessage = "Failed to get project";
				break;
			default:
				break;
		}

		log.error("Failed to get Jira info_response status: {}, method key: {}", response.status(), methodKey);
		HttpStatus statusCode = HttpStatus.valueOf(response.status());
		return ExceptionUtil.handleCommonFeignClientException(statusCode, errorMessage);
	}

}
