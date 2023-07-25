package heartbeat.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RestApiErrorResponse {

	private int status;

	private String message;

	private String hintInfo;

	RestApiErrorResponse(String message) {
		this.message = message;
	}

}
