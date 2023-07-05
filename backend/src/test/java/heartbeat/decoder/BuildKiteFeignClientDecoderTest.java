package heartbeat.decoder;

import static org.junit.jupiter.api.Assertions.assertEquals;

import feign.Response;
import heartbeat.exception.HBTimeoutException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.PermissionDenyException;
import heartbeat.exception.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
class BuildKiteFeignClientDecoderTest {

	private final ResponseMockUtil responseMock = new ResponseMockUtil();
	private BuildKiteFeignClientDecoder decoder;

	@BeforeEach
	void setup() {
		decoder = new BuildKiteFeignClientDecoder();
	}

	@Test
	void testDecode_UnauthorizedException() {
		int statusCode = HttpStatus.UNAUTHORIZED.value();
		Response response = responseMock.getMockResponse(statusCode);

		Exception exception = decoder.decode("methodKey", response);

		assertEquals(UnauthorizedException.class, exception.getClass());
	}

	@Test
	void testDecode_NotFoundException() {
		int statusCode = HttpStatus.NOT_FOUND.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(NotFoundException.class, exception.getClass());
	}

	@Test
	void testDecode_HBTimeoutException() {
		int statusCode = HttpStatus.SERVICE_UNAVAILABLE.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(HBTimeoutException.class, exception.getClass());
	}

	@Test
	void testDecode_PermissionDenyException() {
		int statusCode = HttpStatus.FORBIDDEN.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(PermissionDenyException.class, exception.getClass());
	}

}
