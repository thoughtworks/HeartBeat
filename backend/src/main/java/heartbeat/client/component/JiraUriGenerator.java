package heartbeat.client.component;

import java.net.URI;

public interface JiraUriGenerator {

	URI getUri(String site);

}
