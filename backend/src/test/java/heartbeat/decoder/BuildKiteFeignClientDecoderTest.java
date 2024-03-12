package heartbeat.decoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import feign.Response;
import heartbeat.exception.ServiceUnavailableException;
import heartbeat.client.decoder.BuildKiteFeignClientDecoder;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.RequestFailedException;
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

		assertEquals(ServiceUnavailableException.class, exception.getClass());
	}

	@Test
	void testDecode_4xxRequestFailedException() {
		int statusCode = HttpStatus.METHOD_NOT_ALLOWED.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(RequestFailedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("Client Error"));
	}

	@Test
	void testDecode_5xxRequestFailedException() {
		int statusCode = HttpStatus.BAD_GATEWAY.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(RequestFailedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("Server Error"));
	}

	@Test
	void testDecode_UnKnownException() {
		int statusCode = HttpStatus.SEE_OTHER.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(RequestFailedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("UnKnown Error"));
	}

	@Test
	void shouldDecodeExceptionErrorMessageWhenCallGetTokenInfo() {
		int statusCode = HttpStatus.NOT_FOUND.value();

		Exception exception = decoder.decode("getTokenInfo", responseMock.getMockResponse(statusCode));

		assertEquals("Failed to get token info", exception.getMessage());
	}

	@Test
	void shouldDecodeExceptionErrorMessageWhenCallGetBuildKiteOrganizationsInfo() {
		int statusCode = HttpStatus.NOT_FOUND.value();

		Exception exception = decoder.decode("getBuildKiteOrganizationsInfo", responseMock.getMockResponse(statusCode));

		assertEquals("Failed to get BuildKite OrganizationsInfo info", exception.getMessage());
	}

	@Test
	void shouldDecodeExceptionErrorMessageWhenCallGetPipelineInfo() {
		int statusCode = HttpStatus.NOT_FOUND.value();

		Exception exception = decoder.decode("getPipelineInfo", responseMock.getMockResponse(statusCode));

		assertEquals("Failed to get pipeline info", exception.getMessage());
	}

	@Test
	void shouldDecodeExceptionErrorMessageWhenCallGetPipelineSteps() {
		int statusCode = HttpStatus.NOT_FOUND.value();

		Exception exception = decoder.decode("getPipelineSteps", responseMock.getMockResponse(statusCode));

		assertEquals("Failed to get pipeline steps", exception.getMessage());
	}

	@Test
	void shouldDecodeExceptionErrorMessageWhenCallGetPipelineStepsInfo() {
		int statusCode = HttpStatus.NOT_FOUND.value();

		Exception exception = decoder.decode("getPipelineStepsInfo", responseMock.getMockResponse(statusCode));

		assertEquals("Failed to get pipeline steps info", exception.getMessage());
	}

}
