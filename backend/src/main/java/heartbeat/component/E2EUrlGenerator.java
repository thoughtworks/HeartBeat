package heartbeat.component;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.net.URI;

@Component
@Profile(value = "e2e")
public class E2EUrlGenerator implements UrlGenerator {

	@Value("${jira.url}")
	private String url;

	@Override
	public URI getUri(String site) {
		return URI.create(url);
	}

}
