package heartbeat.service.jira;

import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.client.dto.JiraColumn;
import heartbeat.client.dto.JiraColumnConfig;
import heartbeat.client.dto.JiraColumnStatus;
import heartbeat.controller.board.vo.response.StatusCategory;
import heartbeat.controller.board.vo.response.StatusSelf;

import java.util.List;

public class JiraBoardConfigDTOFixture {

	public static final String BOARD_ID = "123";

	public static final String BOARD_NAME = "jira";

	public static final String SELF_1 = "http://www.example.com/jira/status/1";

	public static final String SELF_2 = "http://www.example.com/jira/status/2";

	public static JiraBoardConfigDTO.JiraBoardConfigDTOBuilder JIRA_BOARD_CONFIG_RESPONSE_BUILDER() {

		return JiraBoardConfigDTO.builder().id(BOARD_ID).name(BOARD_NAME).columnConfig(
			JiraColumnConfig.builder().columns(
					List.of(JiraColumn.builder()
						.name("TODO")
						.statuses(List.of(new JiraColumnStatus("1", SELF_1), new JiraColumnStatus("2", SELF_2)))
						.build())
				)
				.build());
	}

	public static StatusSelf.StatusSelfBuilder DONE_STATUS_SELF_RESPONSE_BUILDER() {
		return StatusSelf.builder()
			.untranslatedName("done")
			.statusCategory(new StatusCategory("done", "done"));
	}

	public static StatusSelf.StatusSelfBuilder DOING_STATUS_SELF_RESPONSE_BUILDER() {
		return StatusSelf.builder()
			.untranslatedName("doing")
			.statusCategory(new StatusCategory("doing", "doing"));
	}
}
