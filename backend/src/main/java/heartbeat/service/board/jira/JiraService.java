package heartbeat.service.board.jira;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.exception.RequestFailedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;

@Service
@RequiredArgsConstructor
public class JiraService {

	private final JiraFeignClient jiraFeignClient;

	public BoardConfigResponse getJiraReconfiguration(BoardRequest boardRequest) {
		String url = "https://" + boardRequest.getSite() + ".atlassian.net";
		JiraBoardConfigDTO jiraBoardConfigDTO;
		try {
			jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(URI.create(url), boardRequest.getBoardId(),
					boardRequest.getToken());
			return BoardConfigResponse.builder().id(jiraBoardConfigDTO.getId()).name(jiraBoardConfigDTO.getName())
					.build();
		}
		catch (FeignException e) {
			throw new RequestFailedException(e.status());
		}
	}

}
