package heartbeat.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class GithubRepoEmptyException extends BaseException {

	public GithubRepoEmptyException(String message) {
		super(message, HttpStatus.BAD_REQUEST.value());
	}

}
