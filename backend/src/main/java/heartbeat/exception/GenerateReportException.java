package heartbeat.exception;

import org.springframework.http.HttpStatus;

public class GenerateReportException extends BaseException {

	public GenerateReportException(String message) {
		super(message, HttpStatus.INTERNAL_SERVER_ERROR.value());
	}

}
