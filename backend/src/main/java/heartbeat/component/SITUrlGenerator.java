package heartbeat.component;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.net.URI;

@Component
@Profile(value = "default")
public class SITUrlGenerator implements UrlGenerator {

	@Override
	public URI getUri(String site) {
		return URI.create("https://" + site + ".atlassian.net");
	}

}
