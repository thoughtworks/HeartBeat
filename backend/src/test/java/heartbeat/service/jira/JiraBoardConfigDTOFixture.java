package heartbeat.service.jira;

import heartbeat.client.dto.AllDoneCardsResponseDTO;
import heartbeat.client.dto.Assignee;
import heartbeat.client.dto.CardHistoryResponseDTO;
import heartbeat.client.dto.JiraCard;
import heartbeat.client.dto.JiraCardFields;
import heartbeat.client.dto.FieldResponseDTO;
import heartbeat.client.dto.IssueField;
import heartbeat.client.dto.Issuetype;
import heartbeat.client.dto.HistoryDetail;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.client.dto.JiraColumn;
import heartbeat.client.dto.JiraColumnConfig;
import heartbeat.client.dto.JiraColumnStatus;
import heartbeat.client.dto.Project;
import heartbeat.client.dto.StatusCategory;
import heartbeat.client.dto.StatusSelfDTO;
import heartbeat.client.dto.Status;
import heartbeat.controller.board.vo.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.board.vo.response.TargetField;
import heartbeat.controller.report.vo.request.JiraBoardSetting;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

public class JiraBoardConfigDTOFixture {

	public static final String BOARD_ID = "123";

	public static final String BOARD_NAME_JIRA = "jira";

	public static final String BOARD_NAME_CLASSIC_JIRA = "classic_jira";

	public static final String COLUM_SELF_ID_1 = "1";

	public static final String COLUM_SELF_ID_2 = "2";

	public static final String COLUM_SELF_ID_3 = "3";

	public static JiraBoardConfigDTO.JiraBoardConfigDTOBuilder JIRA_BOARD_CONFIG_RESPONSE_BUILDER() {

		return JiraBoardConfigDTO.builder()
			.id(BOARD_ID)
			.name(BOARD_NAME_JIRA)
			.columnConfig(JiraColumnConfig.builder()
				.columns(List.of(JiraColumn.builder()
					.name("TODO")
					.statuses(List.of(new JiraColumnStatus(COLUM_SELF_ID_1), new JiraColumnStatus(COLUM_SELF_ID_2)))
					.build()))
				.build());
	}

	public static JiraBoardConfigDTO.JiraBoardConfigDTOBuilder CLASSIC_JIRA_BOARD_CONFIG_RESPONSE_BUILDER() {

		return JiraBoardConfigDTO.builder()
			.id(BOARD_ID)
			.name(BOARD_NAME_CLASSIC_JIRA)
			.columnConfig(JiraColumnConfig.builder()
				.columns(List.of(JiraColumn.builder()
					.name("TODO")
					.statuses(List.of(new JiraColumnStatus(COLUM_SELF_ID_1), new JiraColumnStatus(COLUM_SELF_ID_2),
							new JiraColumnStatus(COLUM_SELF_ID_3)))
					.build()))
				.build());
	}

	public static StatusSelfDTO.StatusSelfDTOBuilder DONE_STATUS_SELF_RESPONSE_BUILDER() {
		return StatusSelfDTO.builder().untranslatedName("done").statusCategory(new StatusCategory("done", "done"));
	}

	public static StatusSelfDTO.StatusSelfDTOBuilder COMPLETE_STATUS_SELF_RESPONSE_BUILDER() {
		return StatusSelfDTO.builder()
			.untranslatedName("complete")
			.statusCategory(new StatusCategory("done", "complete"));
	}

	public static StatusSelfDTO.StatusSelfDTOBuilder NONE_STATUS_SELF_RESPONSE_BUILDER() {
		return StatusSelfDTO.builder().untranslatedName("").statusCategory(new StatusCategory("", ""));
	}

	public static StatusSelfDTO.StatusSelfDTOBuilder DOING_STATUS_SELF_RESPONSE_BUILDER() {
		return StatusSelfDTO.builder().untranslatedName("doing").statusCategory(new StatusCategory("doing", "doing"));
	}

	public static AllDoneCardsResponseDTO.AllDoneCardsResponseDTOBuilder ALL_DONE_CARDS_RESPONSE_BUILDER() {
		return AllDoneCardsResponseDTO.builder()
			.total("2")
			.issues(List.of(new JiraCard("1", JiraCardFields.builder().assignee(new Assignee("Zhang San")).build())));
	}

	public static AllDoneCardsResponseDTO.AllDoneCardsResponseDTOBuilder ALL_DONE_TWO_PAGES_CARDS_RESPONSE_BUILDER() {
		return AllDoneCardsResponseDTO.builder()
			.total("200")
			.issues(List.of(new JiraCard("1", JiraCardFields.builder().assignee(new Assignee("Zhang San")).build())));
	}

	public static AllDoneCardsResponseDTO.AllDoneCardsResponseDTOBuilder ONE_PAGE_NO_DONE_CARDS_RESPONSE_BUILDER() {
		return AllDoneCardsResponseDTO.builder().total("1").issues(Collections.emptyList());
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD_HISTORY_RESPONSE_BUILDER() {
		return CardHistoryResponseDTO.builder()
			.items(List.of(new HistoryDetail(1, "assignee", new Status("San Zhang"), new Status("San Zhang"))));
	}

	public static FieldResponseDTO.FieldResponseDTOBuilder FIELD_RESPONSE_BUILDER() {
		IssueField timetrackingIssueField = new IssueField("timetracking", "Time tracking");
		IssueField summaryIssueField = new IssueField("summary", "Summary");
		IssueField descriptionIssueField = new IssueField("description", "Description");
		IssueField priorityIssueField = new IssueField("priority", "Priority");
		HashMap<String, IssueField> issueFieldMap = new HashMap<>();
		issueFieldMap.put("timetracking", timetrackingIssueField);
		issueFieldMap.put("summary", summaryIssueField);
		issueFieldMap.put("description", descriptionIssueField);
		issueFieldMap.put("priority", priorityIssueField);

		return FieldResponseDTO.builder().projects(List.of(new Project(List.of(new Issuetype(issueFieldMap)))));
	}

	public static JiraBoardSetting.JiraBoardSettingBuilder JIRA_BOARD_SETTING_BUILD() {
		return JiraBoardSetting.builder()
			.boardId("123")
			.boardColumns(List.of())
			.token("token")
			.site("site")
			.doneColumn(List.of("DONE"))
			.treatFlagCardAsBlock(true)
			.type("jira")
			.projectKey("PLL")
			.teamId("HB")
			.teamName("HB")
			.targetFields(List.of(TargetField.builder().key("testKey").name("Story Points").flag(true).build(),
					TargetField.builder().key("testKey").name("Sprint").flag(true).build(),
					TargetField.builder().key("testKey").name("Flagged").flag(true).build()));
	}

	public static StoryPointsAndCycleTimeRequest.StoryPointsAndCycleTimeRequestBuilder STORY_POINTS_FORM_ALL_DONE_CARD() {
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		return StoryPointsAndCycleTimeRequest.builder()
			.token("token")
			.type(jiraBoardSetting.getType())
			.site(jiraBoardSetting.getSite())
			.project(jiraBoardSetting.getProjectKey())
			.boardId(jiraBoardSetting.getBoardId())
			.status(jiraBoardSetting.getDoneColumn())
			.startTime("1672556350000")
			.endTime("1676908799000")
			.targetFields(jiraBoardSetting.getTargetFields())
			.treatFlagCardAsBlock(jiraBoardSetting.getTreatFlagCardAsBlock());
	}

}
