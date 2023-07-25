package heartbeat.exception;

import java.io.IOException;

public class FileIOException extends BaseException {

	public FileIOException(IOException e) {
		super(String.format("File handle error: %s", e.getMessage()), 500);
	}

}
