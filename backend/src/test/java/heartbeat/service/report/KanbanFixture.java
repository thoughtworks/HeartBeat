package heartbeat.service.report;

import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.dto.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.report.dto.request.JiraBoardSetting;

import java.util.List;

public class KanbanFixture {

	public static JiraBoardSetting MOCK_JIRA_BOARD_SETTING() {
		return JiraBoardSetting.builder()
			.users(List.of("user1"))
			.token("token")
			.type("jira")
			.site("site")
			.projectKey("ADM")
			.boardId("2")
			.boardColumns(List.of(RequestJiraBoardColumnSetting.builder().value("DONE").name("DONE").build()))
			.targetFields(List.of(TargetField.builder().key("customer").build()))
			.treatFlagCardAsBlock(true)
			.assigneeFilter("assignee")
			.build();
	}

	public static StoryPointsAndCycleTimeRequest MOCK_EXPECT_STORY_POINT_AND_CYCLE_TIME_REQUEST() {
		return StoryPointsAndCycleTimeRequest.builder()
			.token("token")
			.type("jira")
			.site("site")
			.project("ADM")
			.boardId("2")
			.targetFields(List.of(TargetField.builder().key("customer").build()))
			.treatFlagCardAsBlock(true)
			.startTime("startTime")
			.endTime("endTime")
			.build();
	}

}
