package heartbeat.exception;

import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RestResponseEntityExceptionHandlerTest {

	@InjectMocks
	private RestResponseEntityExceptionHandler restExceptionHandler;

	@Test
	public void shouldHandleRequestFailedException() {
		RequestFailedException ex = new RequestFailedException(400, "Invalid request");

		ResponseEntity<Object> response = restExceptionHandler.handleRequestFailedException(ex);

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("Request failed with status statusCode 400, error: Invalid request", errorResponse.getMessage());
	}

	@Test
	public void shouldHandlePermissionDenyException() {
		PermissionDenyException ex = new PermissionDenyException("Permission deny!");

		ResponseEntity<Object> response = restExceptionHandler.handlePermissionDenyException(ex);

		assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("Permission deny!", errorResponse.getMessage());
	}

	@Test
	public void shouldHandleConflict() {
		RuntimeException ex = new RuntimeException("Invalid argument type");

		ResponseEntity<Object> response = restExceptionHandler.handleConflict(ex);

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("Invalid argument type", errorResponse.getMessage());
	}

	@Test
	@SuppressWarnings("unchecked")
	public void showHandleMethodArgumentNotValid() {
		FieldError fieldError = new FieldError("person", "name", "Name cannot be blank");
		MethodParameter parameter = mock(MethodParameter.class);
		BindingResult result = mock(BindingResult.class);
		when(result.getFieldErrors()).thenReturn(Collections.singletonList(fieldError));
		MethodArgumentNotValidException ex = new MethodArgumentNotValidException(parameter, result);

		ResponseEntity<Object> response = restExceptionHandler.handleMethodArgumentNotValid(ex);

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof Map);
		Map<String, String> fieldErrors = (Map<String, String>) response.getBody();
		assertEquals(1, fieldErrors.size());
		assertTrue(fieldErrors.containsKey("name"));
		assertEquals("Name cannot be blank", fieldErrors.get("name"));
	}

	@Test
	public void shouldHandleConstraintViolation() {
		ConstraintViolationException ex = new ConstraintViolationException("ConstraintViolationException", null);

		ResponseEntity<Object> response = restExceptionHandler.handleConstraintViolation(ex);

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertNotNull(errorResponse.getMessage());
	}

	@Test
	public void shouldHandleServiceUnavailableException() {
		ServiceUnavailableException ex = new ServiceUnavailableException("Service Unavailable");

		ResponseEntity<Object> response = restExceptionHandler.handleTimeoutException(ex);

		assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("Service Unavailable", errorResponse.getMessage());
	}

	@Test
	public void shouldHandleNotFoundException() {
		NotFoundException ex = new NotFoundException("Not found");

		ResponseEntity<Object> response = restExceptionHandler.handleNotFoundException(ex);

		assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("Not found", errorResponse.getMessage());
	}

	@Test
	public void shouldHandleBadRequestException() {
		BadRequestException ex = new BadRequestException("Bad request");

		ResponseEntity<Object> response = restExceptionHandler.handleBadRequestException(ex);

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("Bad request", errorResponse.getMessage());
	}

	@Test
	public void shouldHandleNoContentException() {
		NoContentException ex = new NoContentException("No Content");

		ResponseEntity<Object> response = restExceptionHandler.handleNoContentException(ex);

		assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("No Content", errorResponse.getMessage());
	}

	@Test
	public void shouldHandleUnauthorizedException() {
		UnauthorizedException ex = new UnauthorizedException("Bad credentials");

		ResponseEntity<Object> response = restExceptionHandler.handleUnauthorizedException(ex);

		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("Bad credentials", errorResponse.getMessage());
	}

	@Test
	public void shouldHandleGithubRepoEmptyException() {
		GithubRepoEmptyException ex = new GithubRepoEmptyException("No GitHub repositories found.");

		ResponseEntity<Object> response = restExceptionHandler.handleGithubRepoEmptyException(ex);

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("No GitHub repositories found.", errorResponse.getMessage());
	}

	@Test
	public void shouldHandleFileIOException() {
		FileIOException ex = new FileIOException(new IOException("File read failed"));

		ResponseEntity<Object> response = restExceptionHandler.handleFileIOException(ex);

		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("File handle error: File read failed", errorResponse.getMessage());
	}

	@Test
	public void shouldHandleInternalServerErrorException() {
		InternalServerErrorException ex = new InternalServerErrorException("Internal Server Error");

		ResponseEntity<Object> response = restExceptionHandler.handleInternalServerErrorException(ex);

		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("Internal Server Error", errorResponse.getMessage());
	}

	@Test
	public void shouldHandleDefaultErrorException() {
		IllegalAccessException ex = new IllegalAccessException("Internal Server Error");

		ResponseEntity<Object> response = restExceptionHandler.handleDefaultErrorException(ex);

		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("Internal Server Error", errorResponse.getMessage());
	}

}
