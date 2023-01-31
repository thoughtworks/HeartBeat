package heartbeat.client;

import heartbeat.client.dto.JiraBoardConfigDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.net.URI;

@FeignClient(value = "jiraFeignClient", url = "https://demo.atlassian.net")
public interface JiraFeignClient {

	@GetMapping(path = "/rest/agile/1.0/board/{boardId}/configuration")
	JiraBoardConfigDTO getJiraBoardConfiguration(URI baseUrl, @PathVariable String boardId,
			@RequestHeader String authorization);

}
