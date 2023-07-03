package heartbeat.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
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

	@ExceptionHandler(value = NotFoundException.class)
	protected ResponseEntity<Object> handleNotFoundException(NotFoundException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), "not found"));
	}

	@ExceptionHandler(value = HBTimeoutException.class)
	protected ResponseEntity<Object> handleTimeoutException(HBTimeoutException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), "request timeout"));
	}

	@ExceptionHandler(value = RequestFailedException.class)
	protected ResponseEntity<Object> handleRequestFailedException(RequestFailedException ex) {
		return ResponseEntity.status(ex.getStatus()).body(new RestApiErrorResponse(ex.getMessage()));
	}

	@ExceptionHandler(value = PermissionDenyException.class)
	protected ResponseEntity<Object> handlePermissionDenyException(PermissionDenyException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), "permission deny"));
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<Object> handleConflict(RuntimeException ex) {
		return ResponseEntity.badRequest().body(new RestApiErrorResponse(ex.getMessage()));
	}

	@ExceptionHandler({ MethodArgumentNotValidException.class, BindException.class })
	public ResponseEntity<Object> handleMethodArgumentNotValid(BindException ex) {
		BindingResult result = ex.getBindingResult();
		Map<String, String> fieldErrors = result.getFieldErrors()
			.stream()
			.collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
		return ResponseEntity.badRequest().body(fieldErrors);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException ex) {
		return ResponseEntity.badRequest().body(new RestApiErrorResponse(ex.getMessage()));
	}

}
