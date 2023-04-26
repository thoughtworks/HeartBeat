package heartbeat.controller.board;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import heartbeat.controller.board.dto.request.BoardRequestParam;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Map;

import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_ID;

public class BoardRequestFixture {

	public static BoardRequestParam.BoardRequestParamBuilder BOARD_REQUEST_BUILDER() {
		return BoardRequestParam.builder()
			.boardId(BOARD_ID)
			.projectKey("project key")
			.site("site")
			.token("token")
			.startTime("1672556350000")
			.endTime("1676908799000");
	}

	public static MultiValueMap<String, String> buildParameter(BoardRequestParam boardRequestParam) {
		ObjectMapper objectMapper = new ObjectMapper();
		MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
		Map<String, String> maps = objectMapper.convertValue(boardRequestParam, new TypeReference<>() {
		});
		parameters.setAll(maps);
		return parameters;
	}

}
