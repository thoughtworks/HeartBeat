package heartbeat.component;

import org.junit.jupiter.api.Test;

import java.net.URI;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UrlGeneratorTest {

	private final SITUrlGenerator generator = new SITUrlGenerator();

	@Test
	public void testSITUrlGeneratorGetUri() {
		String siteName = "site";
		URI expectedUri = URI.create("https://site.atlassian.net");
		URI actualUri = generator.getUri(siteName);
		assertEquals(expectedUri, actualUri);
	}

}
