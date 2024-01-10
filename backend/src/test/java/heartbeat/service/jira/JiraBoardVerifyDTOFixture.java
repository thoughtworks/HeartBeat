package heartbeat.service.jira;

import heartbeat.client.dto.board.jira.JiraBoardVerifyDTO;
import heartbeat.client.dto.board.jira.Location;

public class JiraBoardVerifyDTOFixture {

	public static final String BOARD_ID = "1";

	public static final String BOARD_NAME_JIRA = "jira";

	public static final String TYPE = "adm board";

	public static final String PROJECT_KEY = "ADM";

	public static JiraBoardVerifyDTO.JiraBoardVerifyDTOBuilder JIRA_BOARD_VERIFY_RESPONSE_BUILDER() {

		return JiraBoardVerifyDTO.builder()
			.id(BOARD_ID)
			.name(BOARD_NAME_JIRA)
			.type(TYPE)
			.location(Location.builder().projectKey(PROJECT_KEY).build());
	}

	public static JiraBoardVerifyDTO.JiraBoardVerifyDTOBuilder JIRA_BOARD_VERIFY_FAILED_RESPONSE_BUILDER() {
		return JiraBoardVerifyDTO.builder();
	}

}
