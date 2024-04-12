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
		String errorMessage = switch (methodKey) {
			case "getJiraBoardConfiguration" -> "Failed to get jira board configuration";
			case "getColumnStatusCategory" -> "Failed to get column status category";
			case "getJiraCards" -> "Failed to get jira cards";
			case "getJiraCardHistoryByCount" -> "Failed to get jira card history by count";
			case "getTargetField" -> "Failed to get target field";
			case "getBoard" -> "Failed to get board";
			case "getProject" -> "Failed to get project";
			default -> "Failed to get jira info";
		};

		log.error("Failed to get Jira info_response status: {}, method key: {}", response.status(), methodKey);
		HttpStatus statusCode = HttpStatus.valueOf(response.status());
		return ExceptionUtil.handleCommonFeignClientException(statusCode, errorMessage);
	}

}
