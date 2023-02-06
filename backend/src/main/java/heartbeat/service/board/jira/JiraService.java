package heartbeat.service.board.jira;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.client.dto.JiraColumn;
import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.controller.board.vo.response.ColumnResponse;
import heartbeat.controller.board.vo.response.ColumnValue;
import heartbeat.exception.RequestFailedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class JiraService {

	private final JiraFeignClient jiraFeignClient;

	public BoardConfigResponse getJiraReconfiguration(BoardRequest boardRequest) {
		String url = "https://" + boardRequest.getSite() + ".atlassian.net";
		JiraBoardConfigDTO jiraBoardConfigDTO;
		try {
			jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(URI.create(url), boardRequest.getBoardId(),
					boardRequest.getToken());
			return BoardConfigResponse.builder().jiraColumns(jiraBoardConfigDTO.getColumnConfig().getColumns().stream()
					.map(this::mapToResponseColumn).collect(Collectors.toList())).build();
		}
		catch (FeignException e) {
			log.error("Failed when call Jira to get board config", e);
			throw new RequestFailedException(e);
		}
	}

	private ColumnResponse mapToResponseColumn(JiraColumn column) {
		return ColumnResponse.builder().value(ColumnValue.builder().name(column.getName()).build()).build();
	}

}
