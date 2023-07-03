package heartbeat.exception;

import lombok.Getter;

import java.io.IOException;

@Getter
public class FileIOException extends RuntimeException {

	public FileIOException(IOException e) {
		super(String.format("File handle error: %s", e.getMessage()));
	}

}
