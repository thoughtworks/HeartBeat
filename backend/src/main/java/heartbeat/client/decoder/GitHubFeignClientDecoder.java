package heartbeat.client.decoder;

import feign.Response;
import feign.codec.ErrorDecoder;
import heartbeat.util.ExceptionUtil;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;

@Log4j2
public class GitHubFeignClientDecoder implements ErrorDecoder {

	@Override
	public Exception decode(String methodKey, Response response) {
		String errorMessage = "";
		switch (methodKey) {
			case "verifyToken":
				errorMessage = "Failed to verify token";
				break;
			case "verifyCanReadTargetBranch":
				errorMessage = "Failed to verify canRead target branch";
				break;
			case "getCommitInfo":
				errorMessage = "Failed to get commit info";
				break;
			case "getPullRequestCommitInfo":
				errorMessage = "Failed to get pull request commit info";
				break;
			case "getPullRequestListInfo":
				errorMessage = "Failed to get pull request list info";
				break;
			default:
				break;
		}

		log.error("Failed to get GitHub info_response status: {}, method key: {}", response.status(), methodKey);
		HttpStatus statusCode = HttpStatus.valueOf(response.status());
		return ExceptionUtil.handleCommonFeignClientException(statusCode, errorMessage);
	}

}
