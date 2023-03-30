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
		if (url != null && url.length() > 0) {
			if (!url.contains("http") && !url.contains("https")) {
				url = String.format("http://%s", url);
			}
			return URI.create(url);
		}
		else {
			throw new NullPointerException("jira.url is empty");
		}

	}

}
