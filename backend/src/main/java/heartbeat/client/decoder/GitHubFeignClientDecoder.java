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
		String errorMessage = switch (methodKey) {
			case "verifyToken" -> "Failed to verify token";
			case "verifyCanReadTargetBranch" -> "Failed to verify canRead target branch";
			case "getCommitInfo" -> "Failed to get commit info";
			case "getPullRequestCommitInfo" -> "Failed to get pull request commit info";
			case "getPullRequestListInfo" -> "Failed to get pull request list info";
			default -> "Failed to get github info";
		};

		log.error("Failed to get GitHub info_response status: {}, method key: {}", response.status(), methodKey);
		HttpStatus statusCode = HttpStatus.valueOf(response.status());
		return ExceptionUtil.handleCommonFeignClientException(statusCode, errorMessage);
	}

}
