package heartbeat.component;

import org.junit.jupiter.api.Test;

import java.net.URI;

import static org.junit.jupiter.api.Assertions.assertEquals;

class E2EUrlGeneratorTest {

	private final E2EUrlGenerator e2EUrlGenerator = new E2EUrlGenerator();

	@Test
	public void testGetUri() {
		e2EUrlGenerator.setUrl("mockTest");
		URI uri = e2EUrlGenerator.getUri("test");
		assertEquals("mockTest", uri.toString());
	}

}
