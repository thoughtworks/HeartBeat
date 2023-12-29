package heartbeat.client.component;

import org.junit.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.net.URI;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;

class MockJiraUriGeneratorTest {

	private MockJiraUriGenerator generator = new MockJiraUriGenerator();

	@Test
	public void shouldReturnURIWhenUrlHasHttp() {
		String url = "http://test.com";
		ReflectionTestUtils.setField(generator, "url", url);

		URI uri = generator.getUri("test");

		assertEquals(url, uri.toString());
	}

	@Test
	public void shouldReturnURIWhenUrlDoesNotHaveHttp() {
		String url = "test.com";
		ReflectionTestUtils.setField(generator, "url", url);

		URI uri = generator.getUri("test");

		assertEquals("http://" + url, uri.toString());
	}

	@Test
	public void shouldThrowExceptionWhenUrlIsNull() {
		ReflectionTestUtils.setField(generator, "url", null);

		assertThatThrownBy(() -> generator.getUri("test")).isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("jira.url is empty");
	}

	@Test
	public void shouldThrowExceptionWhenUrlIsEmpty() {
		ReflectionTestUtils.setField(generator, "url", "");

		assertThatThrownBy(() -> generator.getUri("test")).isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("jira.url is empty");
	}

}
