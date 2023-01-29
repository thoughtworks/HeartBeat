package heartbeat.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(value = {RequestFailedException.class})
	protected ResponseEntity<Object> handleException(RuntimeException ex) {
		return ResponseEntity.badRequest().body(new RestApiErrorResponse(ex.getMessage()));
	}

}
