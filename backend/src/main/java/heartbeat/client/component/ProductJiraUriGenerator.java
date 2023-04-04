package heartbeat.client.component;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.net.URI;

@Component
@Profile(value = { "default", "local" })
public class ProductJiraUriGenerator implements JiraUriGenerator {

	@Value("${jira.url}")
	private String url;

	@Override
	public URI getUri(String site) {
		String baseUrl = String.format(url, site);
		return URI.create(baseUrl);
	}

}
