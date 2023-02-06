package heartbeat.exception;

import org.springframework.core.convert.ConversionException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestControllerAdvice
public class RestResponseEntityExceptionHandler {

	@ExceptionHandler(value = RequestFailedException.class)
	protected ResponseEntity<Object> handleRequestFailedException(RequestFailedException ex) {
		return ResponseEntity.status(ex.getStatus()).body(new RestApiErrorResponse(ex.getMessage()));
	}

	@ExceptionHandler(ConversionException.class)
	public ResponseEntity<String> handleConflict(RuntimeException ex) {
		return new ResponseEntity<>(ex.getMessage(), BAD_REQUEST);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
		BindingResult result = ex.getBindingResult();
		Map<String, String> fieldErrors = result.getFieldErrors().stream()
				.collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
		return ResponseEntity.badRequest().body(fieldErrors);
	}

}
