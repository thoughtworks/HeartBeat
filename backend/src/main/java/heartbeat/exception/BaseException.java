package heartbeat.exception;

import lombok.Getter;

@Getter
public abstract class BaseException extends RuntimeException {

	protected int status;

	public BaseException(String message, int status) {
		super(message);
		this.status = status;
	}

}
