package heartbeat.exception;

import lombok.Getter;

@Getter
public class GithubRepoEmptyException extends BaseException {

	public GithubRepoEmptyException(String message) {
		super(message, 400);
	}

}
