package heartbeat.handler.base;

import heartbeat.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AsyncExceptionDTO {

	private String message;

	private int status;

	public AsyncExceptionDTO(BaseException e) {
		this.message = e.getMessage();
		this.status = e.getStatus();
	}

}
