package heartbeat.exception;

import org.springframework.core.convert.ConversionException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(value = RequestFailedException.class)
	protected ResponseEntity<Object> handleException(RequestFailedException ex) {
		return ResponseEntity.status(ex.getStatus()).body(new RestApiErrorResponse(ex.getMessage()));
	}

	@ExceptionHandler(ConversionException.class)
	public ResponseEntity<String> handleConflict(RuntimeException ex) {
		return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
	}

}
