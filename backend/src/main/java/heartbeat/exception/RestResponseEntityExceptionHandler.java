package heartbeat.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class RestResponseEntityExceptionHandler {

	@ExceptionHandler(value = RequestFailedException.class)
	protected ResponseEntity<Object> handleRequestFailedException(RequestFailedException ex) {
		return ResponseEntity.status(ex.getStatus()).body(new RestApiErrorResponse(ex.getMessage()));
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<Object> handleConflict(RuntimeException ex) {
		return ResponseEntity.badRequest().body(new RestApiErrorResponse(ex.getMessage()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
		BindingResult result = ex.getBindingResult();
		Map<String, String> fieldErrors = result.getFieldErrors()
			.stream()
			.collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
		return ResponseEntity.badRequest().body(fieldErrors);
	}

}
