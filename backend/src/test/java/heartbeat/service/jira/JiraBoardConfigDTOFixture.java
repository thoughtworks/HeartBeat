package heartbeat.service.jira;

import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.client.dto.JiraColumn;
import heartbeat.client.dto.JiraColumnConfig;

import java.util.List;

public class JiraBoardConfigDTOFixture {

	public static final String BOARD_ID = "123";

	public static final String BOARD_NAME = "jira";

	public static JiraBoardConfigDTO.JiraBoardConfigDTOBuilder JIRA_BOARD_CONFIG_RESPONSE_BUILDER() {

		return JiraBoardConfigDTO.builder()
			.id(BOARD_ID)
			.name(BOARD_NAME)
			.columnConfig(
					JiraColumnConfig.builder().columns(List.of(JiraColumn.builder().name("TODO").build())).build());

	}

}
