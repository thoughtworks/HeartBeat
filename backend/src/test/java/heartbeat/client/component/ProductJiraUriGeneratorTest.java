package heartbeat.client.component;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.net.URI;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ProductJiraUriGeneratorTest {

	@Test
	public void shouldReturnCorrectUri() {
		ProductJiraUriGenerator generator = new ProductJiraUriGenerator();
		ReflectionTestUtils.setField(generator, "url", "https://%s.atlassian.net");

		URI uri = generator.getUri("site");

		assertEquals("https://site.atlassian.net", uri.toString());
	}

}
