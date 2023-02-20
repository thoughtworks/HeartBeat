package heartbeat.service.jira;

import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.client.dto.JiraColumn;
import heartbeat.client.dto.JiraColumnConfig;
import heartbeat.client.dto.JiraColumnStatus;

import java.util.List;

public class JiraBoardConfigDTOFixture {

	public static final String BOARD_ID = "123";

	public static final String BOARD_NAME = "jira";

	public static final String SELF = "http://www.example.com/jira/status/1";

	public static JiraBoardConfigDTO.JiraBoardConfigDTOBuilder JIRA_BOARD_CONFIG_RESPONSE_BUILDER() {

		return JiraBoardConfigDTO.builder().id(BOARD_ID).name(BOARD_NAME).columnConfig(
			JiraColumnConfig.builder().columns(
					List.of(JiraColumn.builder()
						.name("TODO")
						.statuses(List.of(new JiraColumnStatus("1", SELF)))
						.build())
				)
				.build());
	}

}
