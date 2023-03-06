package heartbeat.controller.board;

import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_ID;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_NAME;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import heartbeat.controller.board.vo.request.BoardRequestParam;
import java.util.Map;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

public class BoardRequestFixture {

	public static BoardRequestParam.BoardRequestParamBuilder BOARD_REQUEST_BUILDER() {
		return BoardRequestParam.builder()
			.boardName(BOARD_NAME)
			.boardId(BOARD_ID)
			.email("test@email.com")
			.projectKey("project key")
			.site("site")
			.token("token")
			.startTime("1672556350000")
			.endTime("1676908799000");
	}

	public static MultiValueMap<String, String> buildParameter(
		BoardRequestParam boardRequestParam) {
		ObjectMapper objectMapper = new ObjectMapper();
		MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
		Map<String, String> maps = objectMapper.convertValue(boardRequestParam,
			new TypeReference<>() {
			});
		parameters.setAll(maps);
		return parameters;
	}

}
