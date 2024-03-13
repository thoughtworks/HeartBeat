package heartbeat.decoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import feign.Response;
import heartbeat.exception.PermissionDenyException;
import heartbeat.exception.ServiceUnavailableException;
import heartbeat.client.decoder.GitHubFeignClientDecoder;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.RequestFailedException;
import heartbeat.exception.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
class GitHubFeignClientDecoderTest {

	private final ResponseMockUtil responseMock = new ResponseMockUtil();

	private GitHubFeignClientDecoder decoder;

	@BeforeEach
	void setup() {
		decoder = new GitHubFeignClientDecoder();
	}

	@Test
	void testDecodeUnauthorizedException() {
		int statusCode = HttpStatus.UNAUTHORIZED.value();
		Response response = responseMock.getMockResponse(statusCode);

		Exception exception = decoder.decode("methodKey", response);

		assertEquals(UnauthorizedException.class, exception.getClass());
	}

	@Test
	void testDecodeNotFoundException() {
		int statusCode = HttpStatus.NOT_FOUND.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(NotFoundException.class, exception.getClass());
	}

	@Test
	void testDecode4xxRequestFailedException() {
		int statusCode = HttpStatus.METHOD_NOT_ALLOWED.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(RequestFailedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("Client Error"));
	}

	@Test
	void testDecode5xxRequestFailedException() {
		int statusCode = HttpStatus.BAD_GATEWAY.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(RequestFailedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("Server Error"));
	}

	@Test
	void testDecodeUnKnownException() {
		int statusCode = HttpStatus.SEE_OTHER.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(RequestFailedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("UnKnown Error"));
	}

	@Test
	void testDecodeTimeoutException() {
		int statusCode = HttpStatus.SERVICE_UNAVAILABLE.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(ServiceUnavailableException.class, exception.getClass());
	}

	@Test
	void testDecodePermissionDenyException() {
		int statusCode = HttpStatus.FORBIDDEN.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(PermissionDenyException.class, exception.getClass());
	}

	@ParameterizedTest
	@CsvSource({ "verifyToken,Failed to verify token",
			"verifyCanReadTargetBranch,Failed to verify canRead target branch",
			"getCommitInfo,Failed to get commit info",
			"getPullRequestCommitInfo,Failed to get pull request commit info",
			"getPullRequestListInfo,Failed to get pull request list info"

	})
	void shouldDecodeExceptionErrorMessage(String methodKey, String expectMsg) {
		int statusCode = HttpStatus.NOT_FOUND.value();

		Exception exception = decoder.decode(methodKey, responseMock.getMockResponse(statusCode));

		assertEquals(expectMsg, exception.getMessage());
	}

}
