package heartbeat.component;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.net.URI;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Profile("e2e")
@ExtendWith(SpringExtension.class)
class E2EUrlGeneratorTest {

	private final E2EUrlGenerator e2EUrlGenerator = new E2EUrlGenerator();

	@Test
	public void testGetUri() {
		e2EUrlGenerator.setUrl("mockTest");
		URI uri = e2EUrlGenerator.getUri("test");
		assertEquals("mockTest", uri.toString());
	}

}
