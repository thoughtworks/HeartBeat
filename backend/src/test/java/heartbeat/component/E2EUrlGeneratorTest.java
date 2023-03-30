package heartbeat.component;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.net.URI;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;

class E2EUrlGeneratorTest {

	private final E2EUrlGenerator e2EUrlGenerator = new E2EUrlGenerator();

	@Test
	public void shouldReturnURIWhenUrlHasHttp() {
		String url = "http://test.com";
		ReflectionTestUtils.setField(e2EUrlGenerator, "url", url);

		URI uri = e2EUrlGenerator.getUri("test");

		assertEquals(url, uri.toString());
	}

	@Test
	public void shouldReturnURIWhenUrlHasHttps() {
		String url = "https://test.com";
		ReflectionTestUtils.setField(e2EUrlGenerator, "url", url);

		URI uri = e2EUrlGenerator.getUri("test");

		assertEquals(url, uri.toString());
	}

	@Test
	public void shouldReturnURIWhenUrlDoesNotHaveHttp() {
		String url = "test.com";
		ReflectionTestUtils.setField(e2EUrlGenerator, "url", url);

		URI uri = e2EUrlGenerator.getUri("test");

		assertEquals("http://" + url, uri.toString());
	}

	@Test
	public void shouldThrowExceptionWhenUrlIsNull() {
		ReflectionTestUtils.setField(e2EUrlGenerator, "url", null);

		assertThatThrownBy(() -> e2EUrlGenerator.getUri("test")).isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("jira.url is empty");
	}

	@Test
	public void shouldThrowExceptionWhenUrlIsEmpty() {
		ReflectionTestUtils.setField(e2EUrlGenerator, "url", "");

		assertThatThrownBy(() -> e2EUrlGenerator.getUri("test")).isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("jira.url is empty");
	}

}
