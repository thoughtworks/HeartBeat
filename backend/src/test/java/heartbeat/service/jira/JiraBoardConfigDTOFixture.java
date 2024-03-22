package heartbeat.service.jira;

import heartbeat.client.dto.board.jira.AllCardsResponseDTO;
import heartbeat.client.dto.board.jira.Assignee;
import heartbeat.client.dto.board.jira.CardHistoryResponseDTO;
import heartbeat.client.dto.board.jira.FieldResponseDTO;
import heartbeat.client.dto.board.jira.HistoryDetail;
import heartbeat.client.dto.board.jira.IssueField;
import heartbeat.client.dto.board.jira.Issuetype;
import heartbeat.client.dto.board.jira.JiraBoardConfigDTO;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraCardField;
import heartbeat.client.dto.board.jira.JiraColumn;
import heartbeat.client.dto.board.jira.JiraColumnConfig;
import heartbeat.client.dto.board.jira.JiraColumnStatus;
import heartbeat.client.dto.board.jira.Project;
import heartbeat.client.dto.board.jira.Status;
import heartbeat.client.dto.board.jira.StatusCategory;
import heartbeat.client.dto.board.jira.StatusSelfDTO;
import heartbeat.controller.board.dto.request.CardStepsEnum;
import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.dto.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.board.dto.response.CycleTimeInfo;
import heartbeat.controller.board.dto.response.IssueType;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.report.dto.request.JiraBoardSetting;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

public class JiraBoardConfigDTOFixture {

	public static final String BOARD_ID = "unknown";

	public static final String BOARD_NAME_JIRA = "jira";

	public static final String BOARD_NAME_CLASSIC_JIRA = "classic-jira";

	public static final String COLUM_SELF_ID_1 = "1";

	public static final String COLUM_SELF_ID_2 = "2";

	public static final String COLUM_SELF_ID_3 = "3";

	public static final String BLOCK = "Block";

	public static final String ANALYSE = "Analysis";

	public static final String IN_DEV = "In Dev";

	public static final String REVIEW = "Review";

	public static final String TESTING = "Testing";

	public static final String DONE = "Done";

	public static final String FLAG = "FLAG";

	public static final String UNKNOWN = "UNKNOWN";

	public static final String WAITING_FOR_TESTING = "Waiting for testing";

	public static final String ASSIGNEE_NAME = "Zhang San";

	public static final String DISPLAY_NAME_ONE = "Da Pei";

	public static final String DISPLAY_NAME_TWO = "Xiao Pei";

	public static final String START_TIME = "1672556350000";

	public static final String END_TIME = "1676908799000";

	public static final long TIMESTAMP_1 = 1673556350000L;

	public static final long TIMESTAMP_2 = 1674556350000L;

	public static final long TIMESTAMP_3 = 1673556350001L;

	public static final long TIMESTAMP_4 = 1675556350001L;

	public static final long TIMESTAMP_5 = 1676556350001L;

	public static final long TIMESTAMP_6 = 1676856350001L;

	public static final String JIRA_CARD_WITH_TWO_SPRINT = "{\"startAt\":0,\"total\":5,\"issues\":[{\"key\":\"TS-1\",\"fields\":{\"assignee\":{\"displayName\":\"Zhang San\"},\"customfield_10020\":[{\"name\":\"TS Sprint 1\",\"completeDate\":\"2024-02-08T03:52:22.395Z\"},{\"name\":\"TS Sprint 2\",\"completeDate\":\"2024-02-07T04:21:14.512Z\"}]}}]}";

	public static final long TIMESTAMP_7 = 1676656350001L;

	public static final long TIMESTAMP_8 = 1676708799000L;

	public static final long TIMESTAMP_9 = 1676808799000L;

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

	public static AllCardsResponseDTO.AllCardsResponseDTOBuilder ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER() {
		return AllCardsResponseDTO.builder()
			.total("2")
			.issues(List.of(
					new JiraCard("1",
							JiraCardField.builder().assignee(new Assignee(ASSIGNEE_NAME)).storyPoints(2).build()),
					new JiraCard("1",
							JiraCardField.builder().assignee(new Assignee(ASSIGNEE_NAME)).storyPoints(1).build()),
					new JiraCard("1",
							JiraCardField.builder().assignee(new Assignee(ASSIGNEE_NAME)).storyPoints(3).build()),
					new JiraCard("1",
							JiraCardField.builder().assignee(new Assignee(ASSIGNEE_NAME)).storyPoints(5).build()),
					new JiraCard("2",
							JiraCardField.builder().assignee(new Assignee(ASSIGNEE_NAME)).storyPoints(5).build())));
	}

	public static AllCardsResponseDTO.AllCardsResponseDTOBuilder ALL_REAL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER() {
		return AllCardsResponseDTO.builder()
			.total("2")
			.issues(List.of(
					new JiraCard("1",
							JiraCardField.builder()
								.status(new Status())
								.assignee(new Assignee(ASSIGNEE_NAME))
								.storyPoints(2)
								.build()),
					new JiraCard("1",
							JiraCardField.builder()
								.status(new Status())
								.assignee(new Assignee(ASSIGNEE_NAME))
								.storyPoints(1)
								.build()),
					new JiraCard("1",
							JiraCardField.builder()
								.status(new Status())
								.assignee(new Assignee(ASSIGNEE_NAME))
								.storyPoints(3)
								.build()),
					new JiraCard("1",
							JiraCardField.builder()
								.status(new Status())
								.assignee(new Assignee(ASSIGNEE_NAME))
								.storyPoints(5)
								.build()),
					new JiraCard("2",
							JiraCardField.builder()
								.status(new Status())
								.assignee(new Assignee(ASSIGNEE_NAME))
								.storyPoints(5)
								.build())));
	}

	public static AllCardsResponseDTO.AllCardsResponseDTOBuilder NEED_FILTERED_ALL_DONE_CARDS_BUILDER() {
		return AllCardsResponseDTO.builder()
			.total("2")
			.issues(List.of(
					new JiraCard("1",
							JiraCardField.builder().assignee(new Assignee(ASSIGNEE_NAME)).storyPoints(5).build()),
					new JiraCard("2",
							JiraCardField.builder().assignee(new Assignee(ASSIGNEE_NAME)).storyPoints(5).build())));
	}

	public static AllCardsResponseDTO.AllCardsResponseDTOBuilder ALL_NON_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER() {
		return AllCardsResponseDTO.builder()
			.total("3")
			.issues(List.of(
					new JiraCard("1",
							JiraCardField.builder()
								.assignee(new Assignee(ASSIGNEE_NAME))
								.issuetype(IssueType.builder().name("缺陷").build())
								.storyPoints(2)
								.status(new Status(CardStepsEnum.TESTING.getValue()))
								.build()),
					new JiraCard("2",
							JiraCardField.builder()
								.assignee(new Assignee(ASSIGNEE_NAME))
								.issuetype(IssueType.builder().name("缺陷").build())
								.status(new Status(CardStepsEnum.TESTING.getValue()))
								.storyPoints(1)
								.build()),
					new JiraCard("3",
							JiraCardField.builder()
								.assignee(new Assignee(ASSIGNEE_NAME))
								.issuetype(IssueType.builder().name("缺陷").build())
								.status(new Status(CardStepsEnum.DONE.getValue()))
								.build())));
	}

	public static AllCardsResponseDTO.AllCardsResponseDTOBuilder ALL_DONE_TWO_PAGES_CARDS_RESPONSE_BUILDER() {
		return AllCardsResponseDTO.builder()
			.total("200")
			.issues(List.of(new JiraCard("1", JiraCardField.builder().assignee(new Assignee(ASSIGNEE_NAME)).build())));
	}

	public static AllCardsResponseDTO.AllCardsResponseDTOBuilder ONE_PAGE_NO_DONE_CARDS_RESPONSE_BUILDER() {
		return AllCardsResponseDTO.builder().total("1").issues(Collections.emptyList());
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD_HISTORY_RESPONSE_BUILDER() {
		return CardHistoryResponseDTO.builder()
			.isLast(true)
			.items(List.of(new HistoryDetail(2, "status", new Status("In Dev"), new Status("To do"), null, null),
					new HistoryDetail(3, "status", new Status(REVIEW), new Status("In Dev"), null, null),
					new HistoryDetail(4, "status", new Status(WAITING_FOR_TESTING), new Status(REVIEW), null, null),
					new HistoryDetail(5, "status", new Status(TESTING), new Status(WAITING_FOR_TESTING), null, null),
					new HistoryDetail(1662642750003L, "status", new Status("Done"), new Status(TESTING), null, null)));
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD_HISTORY_REAL_DONE_RESPONSE_BUILDER() {
		return CardHistoryResponseDTO.builder()
			.isLast(true)
			.items(List.of(
					new HistoryDetail(1672556350002L, "status", new Status("In Dev"), new Status("To do"), null, null),
					new HistoryDetail(1672556350003L, "status", new Status(REVIEW), new Status("In Dev"), null, null),
					new HistoryDetail(1672556350004L, "status", new Status(WAITING_FOR_TESTING), new Status(REVIEW),
							null, null),
					new HistoryDetail(1672556350005L, "status", new Status(TESTING), new Status(WAITING_FOR_TESTING),
							null, null),
					new HistoryDetail(1672556350006L, "status", new Status(BLOCK), new Status(TESTING), null, null),
					new HistoryDetail(1672556350007L, "status", new Status(WAITING_FOR_TESTING), new Status(BLOCK),
							null, null),
					new HistoryDetail(1672556350008L, "status", new Status(TESTING), new Status(WAITING_FOR_TESTING),
							null, null),
					new HistoryDetail(1672556350010L, "status", new Status("Done"), new Status(TESTING), null, null)));
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD_HISTORY_RESPONSE_BUILDER_TO_DONE() {
		return CardHistoryResponseDTO.builder()
			.isLast(true)
			.items(List.of(new HistoryDetail(2, "status", new Status("In Dev"), new Status("To do"), null, null),
					new HistoryDetail(3, "status", new Status(REVIEW), new Status("In Dev"), null, null),
					new HistoryDetail(4, "status", new Status(WAITING_FOR_TESTING), new Status(REVIEW), null, null),
					new HistoryDetail(5, "status", new Status("DONE"), new Status(WAITING_FOR_TESTING), null, null)));
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD_HISTORY_MULTI_RESPONSE_BUILDER() {
		return CardHistoryResponseDTO.builder()
			.isLast(true)
			.items(List.of(new HistoryDetail(1, "status", new Status("To do"), new Status(BLOCK), null, null),
					new HistoryDetail(2, "assignee", new Status("In Dev"), new Status("To do"), null, null),
					new HistoryDetail(3, "status", new Status(REVIEW), new Status("In Dev"), null, null),
					new HistoryDetail(4, "status", new Status(WAITING_FOR_TESTING), new Status(REVIEW), null, null),
					new HistoryDetail(1672642740000L, "status", new Status(TESTING), new Status(WAITING_FOR_TESTING),
							null, null),
					new HistoryDetail(1672642740001L, "status", new Status(BLOCK), new Status(TESTING), null, null),
					new HistoryDetail(1672642740002L, "status", new Status(FLAG), new Status(BLOCK), null, null),
					new HistoryDetail(1672642750001L, "customfield_10021", new Status("Impediment"), new Status(FLAG),
							null, null),
					new HistoryDetail(1672642750002L, "flagged", new Status("Impediment"), new Status("removeFlag"),
							null, null),
					new HistoryDetail(1672642750003L, "status", new Status("Done"), new Status(TESTING), null, null),
					new HistoryDetail(1672642750004L, "status", new Status("Done"), new Status(TESTING), null, null),
					new HistoryDetail(1672642750005L, "customfield_10021", new Status(UNKNOWN),
							new Status("removeFlag"), null, null)));
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD_HISTORY_MULTI_REAL_DONE_RESPONSE_BUILDER() {
		return CardHistoryResponseDTO.builder()
			.isLast(true)
			.items(List.of(
					new HistoryDetail(1672642730000L, "status", new Status("To do"), new Status(BLOCK), null, null),
					new HistoryDetail(1672642730000L, "assignee", new Status("In Dev"), new Status("To do"), null,
							null),
					new HistoryDetail(1672642730000L, "status", new Status(REVIEW), new Status("In Dev"), null, null),
					new HistoryDetail(1672642730000L, "status", new Status(WAITING_FOR_TESTING), new Status(REVIEW),
							null, null),
					new HistoryDetail(1672642740000L, "status", new Status(TESTING), new Status(WAITING_FOR_TESTING),
							null, null),
					new HistoryDetail(1672642740001L, "status", new Status(BLOCK), new Status(TESTING), null, null),
					new HistoryDetail(1672642740002L, "status", new Status(FLAG), new Status(BLOCK), null, null),
					new HistoryDetail(1672642750001L, "customfield_10021", new Status("Impediment"), new Status(FLAG),
							null, null),
					new HistoryDetail(1672642750002L, "flagged", new Status("Impediment"), new Status("removeFlag"),
							null, null),
					new HistoryDetail(1672642750003L, "status", new Status("Done"), new Status(TESTING), null, null),
					new HistoryDetail(1672642750004L, "status", new Status("Done"), new Status(TESTING), null, null),
					new HistoryDetail(1672642750005L, "customfield_10021", new Status(UNKNOWN),
							new Status("removeFlag"), null, null)));
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD_HISTORY_DONE_TIME_GREATER_THAN_END_TIME_BUILDER() {
		return CardHistoryResponseDTO.builder()
			.items(List.of(new HistoryDetail(1, "status", new Status("To do"), new Status(BLOCK), null, null),
					new HistoryDetail(2, "assignee", new Status("In Dev"), new Status("To do"), null, null),
					new HistoryDetail(3, "status", new Status(REVIEW), new Status("In Dev"), null, null),
					new HistoryDetail(4, "status", new Status(WAITING_FOR_TESTING), new Status(REVIEW), null, null),
					new HistoryDetail(1682642740000L, "status", new Status(TESTING), new Status(WAITING_FOR_TESTING),
							null, null),
					new HistoryDetail(1682642740001L, "status", new Status(BLOCK), new Status(TESTING), null, null),
					new HistoryDetail(1682642740002L, "status", new Status(FLAG), new Status(BLOCK), null, null),
					new HistoryDetail(1682642750001L, "customfield_10021", new Status("Impediment"), new Status(FLAG),
							null, null),
					new HistoryDetail(1682642750002L, "flagged", new Status("Impediment"), new Status("removeFlag"),
							null, null),
					new HistoryDetail(1686908799000L, "status", new Status("Done"), new Status(TESTING), null, null)));
	}

	public static FieldResponseDTO.FieldResponseDTOBuilder FIELD_RESPONSE_BUILDER() {
		IssueField storyPointIssueField = new IssueField("customfield_10016", "Story point estimate");
		IssueField sprintIssueField = new IssueField("customfield_10020", "Sprint");
		IssueField flaggedIssueField = new IssueField("customfield_10021", "Flagged");
		IssueField summaryIssueField = new IssueField("summary", "customfield_10029");
		HashMap<String, IssueField> issueFieldMap = new HashMap<>();
		issueFieldMap.put("customfield_10016", storyPointIssueField);
		issueFieldMap.put("customfield_10020", sprintIssueField);
		issueFieldMap.put("customfield_10021", flaggedIssueField);
		issueFieldMap.put("customfield_10029", summaryIssueField);

		return FieldResponseDTO.builder().projects(List.of(new Project(List.of(new Issuetype(issueFieldMap)))));
	}

	public static FieldResponseDTO.FieldResponseDTOBuilder ALL_FIELD_RESPONSE_BUILDER() {
		IssueField timetrackingIssueField = new IssueField("timetracking", "Time tracking");
		IssueField summaryIssueField = new IssueField("summary", "Summary");
		IssueField sprintIssueField = new IssueField("customfield_10020", "Sprint");
		IssueField descriptionIssueField = new IssueField("description", "Description");
		IssueField priorityIssueField = new IssueField("priority", "Priority");
		IssueField flaggedIssueField = new IssueField("customfield_10021", "Flagged");
		HashMap<String, IssueField> issueFieldMap = new HashMap<>();
		issueFieldMap.put("timetracking", timetrackingIssueField);
		issueFieldMap.put("summary", summaryIssueField);
		issueFieldMap.put("description", descriptionIssueField);
		issueFieldMap.put("priority", priorityIssueField);
		issueFieldMap.put("customfield_10021", flaggedIssueField);
		issueFieldMap.put("customfield_10020", sprintIssueField);

		return FieldResponseDTO.builder().projects(List.of(new Project(List.of(new Issuetype(issueFieldMap)))));
	}

	public static FieldResponseDTO.FieldResponseDTOBuilder ALL_FIELD_RESPONSE_BUILDER_HAS_STORY_POINT() {
		IssueField timetrackingIssueField = new IssueField("timetracking", "Time tracking");
		IssueField summaryIssueField = new IssueField("summary", "Summary");
		IssueField descriptionIssueField = new IssueField("description", "Description");
		IssueField priorityIssueField = new IssueField("priority", "Priority");
		IssueField flaggedIssueField = new IssueField("customfield_10021", "Flagged");
		IssueField storyPointIssueField = new IssueField("customfield_10006", "story points");
		HashMap<String, IssueField> issueFieldMap = new HashMap<>();
		issueFieldMap.put("timetracking", timetrackingIssueField);
		issueFieldMap.put("summary", summaryIssueField);
		issueFieldMap.put("description", descriptionIssueField);
		issueFieldMap.put("priority", priorityIssueField);
		issueFieldMap.put("customfield_10021", flaggedIssueField);
		issueFieldMap.put("customfield_10006", storyPointIssueField);

		return FieldResponseDTO.builder().projects(List.of(new Project(List.of(new Issuetype(issueFieldMap)))));
	}

	public static FieldResponseDTO.FieldResponseDTOBuilder INCLUDE_UNREASONABLE_FIELD_RESPONSE_BUILDER() {
		IssueField timetrackingIssueField = new IssueField("timetracking", "Time tracking");
		IssueField priorityIssueField = new IssueField("priority", "Priority");
		IssueField flaggedIssueField = new IssueField("customfield_10021", "Flagged");
		IssueField developmentField = new IssueField("customfield_10000", "Development");
		IssueField rankField = new IssueField("customfield_10019", "Rank");

		HashMap<String, IssueField> issueFieldMap = new HashMap<>();

		issueFieldMap.put("customfield_10021", flaggedIssueField);
		issueFieldMap.put("timetracking", timetrackingIssueField);
		issueFieldMap.put("priority", priorityIssueField);
		issueFieldMap.put("customfield_10000", developmentField);
		issueFieldMap.put("customfield_10019", rankField);

		return FieldResponseDTO.builder().projects(List.of(new Project(List.of(new Issuetype(issueFieldMap)))));
	}

	public static JiraBoardSetting.JiraBoardSettingBuilder JIRA_BOARD_SETTING_BUILD() {
		return JiraBoardSetting.builder()
			.boardId(BOARD_ID)
			.boardColumns(List.of(RequestJiraBoardColumnSetting.builder().name(IN_DEV).value(IN_DEV).build(),
					RequestJiraBoardColumnSetting.builder().name(ANALYSE).value(ANALYSE).build(),
					RequestJiraBoardColumnSetting.builder()
						.name(WAITING_FOR_TESTING)
						.value(WAITING_FOR_TESTING)
						.build(),
					RequestJiraBoardColumnSetting.builder().name(BLOCK).value(BLOCK).build(),
					RequestJiraBoardColumnSetting.builder().name(TESTING).value(TESTING).build(),
					RequestJiraBoardColumnSetting.builder().name(REVIEW).value(REVIEW).build(),
					RequestJiraBoardColumnSetting.builder().name(FLAG).value(FLAG).build(),
					RequestJiraBoardColumnSetting.builder().name(UNKNOWN).value(UNKNOWN).build()))
			.token("token")
			.site("site")
			.doneColumn(List.of("DONE"))
			.treatFlagCardAsBlock(true)
			.type("jira")
			.projectKey("PLL")
			.targetFields(List.of(TargetField.builder().key("testKey1").name("Story Points").flag(true).build(),
					TargetField.builder().key("testKey2").name("Sprint").flag(true).build(),
					TargetField.builder().key("testKey3").name("Flagged").flag(true).build()));
	}

	public static JiraBoardSetting.JiraBoardSettingBuilder JIRA_BOARD_REAL_DONE_SETTING_BUILD() {
		return JiraBoardSetting.builder()
			.boardId(BOARD_ID)
			.boardColumns(List.of(RequestJiraBoardColumnSetting.builder().name(IN_DEV).value(IN_DEV).build(),
					RequestJiraBoardColumnSetting.builder().name(ANALYSE).value(ANALYSE).build(),
					RequestJiraBoardColumnSetting.builder()
						.name(WAITING_FOR_TESTING)
						.value(WAITING_FOR_TESTING)
						.build(),
					RequestJiraBoardColumnSetting.builder().name(BLOCK).value(BLOCK).build(),
					RequestJiraBoardColumnSetting.builder().name(TESTING).value(DONE).build(),
					RequestJiraBoardColumnSetting.builder().name(REVIEW).value(REVIEW).build(),
					RequestJiraBoardColumnSetting.builder().name(FLAG).value(FLAG).build(),
					RequestJiraBoardColumnSetting.builder().name(UNKNOWN).value(UNKNOWN).build()))
			.token("token")
			.site("site")
			.doneColumn(List.of(TESTING, "DONE"))
			.treatFlagCardAsBlock(true)
			.type("jira")
			.projectKey("PLL")
			.targetFields(List.of(TargetField.builder().key("testKey1").name("Story Points").flag(true).build(),
					TargetField.builder().key("testKey2").name("Sprint").flag(true).build(),
					TargetField.builder().key("testKey3").name("Flagged").flag(true).build()));
	}

	public static JiraBoardSetting.JiraBoardSettingBuilder CLASSIC_JIRA_BOARD_SETTING_BUILD() {
		return JiraBoardSetting.builder()
			.boardId(BOARD_ID)
			.boardColumns(List.of(RequestJiraBoardColumnSetting.builder().name("In Dev").value("In Dev").build(),
					RequestJiraBoardColumnSetting.builder()
						.name(WAITING_FOR_TESTING)
						.value(WAITING_FOR_TESTING)
						.build(),
					RequestJiraBoardColumnSetting.builder().name(BLOCK).value(BLOCK).build(),
					RequestJiraBoardColumnSetting.builder().name(TESTING).value(TESTING).build(),
					RequestJiraBoardColumnSetting.builder().name(REVIEW).value(REVIEW).build(),
					RequestJiraBoardColumnSetting.builder().name(FLAG).value(FLAG).build(),
					RequestJiraBoardColumnSetting.builder().name(UNKNOWN).value(UNKNOWN).build()))
			.token("token")
			.site("site")
			.doneColumn(List.of("DONE_A", "DONE_B"))
			.treatFlagCardAsBlock(true)
			.type("classic-jira")
			.projectKey("PLL")
			.targetFields(List.of(TargetField.builder().key("testKey1").name("Story Points").flag(true).build(),
					TargetField.builder().key("testKey2").name("Sprint").flag(true).build(),
					TargetField.builder().key("testKey3").name("Flagged").flag(true).build()));
	}

	public static JiraBoardSetting.JiraBoardSettingBuilder INCORRECT_JIRA_BOARD_SETTING_BUILD() {
		return JiraBoardSetting.builder()
			.boardId(BOARD_ID)
			.boardColumns(List.of(RequestJiraBoardColumnSetting.builder().name("In Dev").value("In Dev").build(),
					RequestJiraBoardColumnSetting.builder()
						.name(WAITING_FOR_TESTING)
						.value(WAITING_FOR_TESTING)
						.build(),
					RequestJiraBoardColumnSetting.builder().name(BLOCK).value(BLOCK).build(),
					RequestJiraBoardColumnSetting.builder().name(TESTING).value(TESTING).build(),
					RequestJiraBoardColumnSetting.builder().name(REVIEW).value(REVIEW).build(),
					RequestJiraBoardColumnSetting.builder().name(FLAG).value(FLAG).build(),
					RequestJiraBoardColumnSetting.builder().name(UNKNOWN).value(UNKNOWN).build()))
			.token("token")
			.site("site")
			.doneColumn(List.of("DONE_A", "DONE_B"))
			.treatFlagCardAsBlock(true)
			.type(BOARD_ID)
			.projectKey("PLL")
			.targetFields(List.of(TargetField.builder().key("testKey1").name("Story Points").flag(true).build(),
					TargetField.builder().key("testKey2").name("Sprint").flag(true).build(),
					TargetField.builder().key("testKey3").name("Flagged").flag(true).build()));
	}

	public static JiraBoardSetting.JiraBoardSettingBuilder JIRA_BOARD_SETTING_HAVE_UNKNOWN_COLUMN_BUILD() {
		return JiraBoardSetting.builder()
			.boardId("jira")
			.boardColumns(List.of(RequestJiraBoardColumnSetting.builder().name("In Dev").value("In Dev").build(),
					RequestJiraBoardColumnSetting.builder()
						.name(WAITING_FOR_TESTING)
						.value(WAITING_FOR_TESTING)
						.build(),
					RequestJiraBoardColumnSetting.builder().name(BLOCK).value(BLOCK).build(),
					RequestJiraBoardColumnSetting.builder().name(TESTING).value(TESTING).build(),
					RequestJiraBoardColumnSetting.builder().name(REVIEW).value(REVIEW).build(),
					RequestJiraBoardColumnSetting.builder().name(FLAG).value(FLAG).build(),
					RequestJiraBoardColumnSetting.builder().name("xxxx").value("xxxx").build()))
			.token("token")
			.site("site")
			.doneColumn(List.of("DONE"))
			.treatFlagCardAsBlock(true)
			.type("jira")
			.projectKey("PLL")
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
			.startTime(START_TIME)
			.endTime(END_TIME)
			.targetFields(jiraBoardSetting.getTargetFields())
			.treatFlagCardAsBlock(jiraBoardSetting.getTreatFlagCardAsBlock());
	}

	public static StoryPointsAndCycleTimeRequest.StoryPointsAndCycleTimeRequestBuilder STORY_POINTS_FORM_ALL_REAL_DONE_CARD() {
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_REAL_DONE_SETTING_BUILD().build();
		return StoryPointsAndCycleTimeRequest.builder()
			.token("token")
			.type(jiraBoardSetting.getType())
			.site(jiraBoardSetting.getSite())
			.project(jiraBoardSetting.getProjectKey())
			.boardId(jiraBoardSetting.getBoardId())
			.status(jiraBoardSetting.getDoneColumn())
			.startTime(START_TIME)
			.endTime(END_TIME)
			.targetFields(jiraBoardSetting.getTargetFields())
			.treatFlagCardAsBlock(jiraBoardSetting.getTreatFlagCardAsBlock());
	}

	public static StoryPointsAndCycleTimeRequest.StoryPointsAndCycleTimeRequestBuilder CLASSIC_JIRA_STORY_POINTS_FORM_ALL_DONE_CARD() {
		JiraBoardSetting jiraBoardSetting = CLASSIC_JIRA_BOARD_SETTING_BUILD().build();
		return StoryPointsAndCycleTimeRequest.builder()
			.token("token")
			.type(jiraBoardSetting.getType())
			.site(jiraBoardSetting.getSite())
			.project(jiraBoardSetting.getProjectKey())
			.boardId(jiraBoardSetting.getBoardId())
			.status(List.of("Done", "Testing"))
			.startTime(START_TIME)
			.endTime(END_TIME)
			.targetFields(jiraBoardSetting.getTargetFields())
			.treatFlagCardAsBlock(jiraBoardSetting.getTreatFlagCardAsBlock());
	}

	public static StoryPointsAndCycleTimeRequest.StoryPointsAndCycleTimeRequestBuilder INCORRECT_JIRA_STORY_POINTS_FORM_ALL_DONE_CARD() {
		JiraBoardSetting jiraBoardSetting = INCORRECT_JIRA_BOARD_SETTING_BUILD().build();
		return StoryPointsAndCycleTimeRequest.builder()
			.token("token")
			.type(jiraBoardSetting.getType())
			.site(jiraBoardSetting.getSite())
			.project(jiraBoardSetting.getProjectKey())
			.boardId(jiraBoardSetting.getBoardId())
			.status(jiraBoardSetting.getDoneColumn())
			.startTime(START_TIME)
			.endTime(END_TIME)
			.targetFields(jiraBoardSetting.getTargetFields())
			.treatFlagCardAsBlock(jiraBoardSetting.getTreatFlagCardAsBlock());
	}

	public static StoryPointsAndCycleTimeRequest.StoryPointsAndCycleTimeRequestBuilder STORY_POINTS_FORM_ALL_DONE_CARD_WITH_EMPTY_STATUS() {
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		return StoryPointsAndCycleTimeRequest.builder()
			.token("token")
			.type(jiraBoardSetting.getType())
			.site(jiraBoardSetting.getSite())
			.project(jiraBoardSetting.getProjectKey())
			.boardId(jiraBoardSetting.getBoardId())
			.status(Collections.emptyList())
			.startTime(START_TIME)
			.endTime(END_TIME)
			.targetFields(jiraBoardSetting.getTargetFields())
			.treatFlagCardAsBlock(jiraBoardSetting.getTreatFlagCardAsBlock());
	}

	public static List<CycleTimeInfo> CYCLE_TIME_INFO_LIST() {
		return List.of(CycleTimeInfo.builder().column("WAITING FOR TESTING").day(1.0).build(),
				CycleTimeInfo.builder().column("TESTING").day(2.0).build(),
				CycleTimeInfo.builder().column("IN DEV").day(3.0).build(),
				CycleTimeInfo.builder().column("REVIEW").day(4.0).build(),
				CycleTimeInfo.builder().column("ANALYSIS").day(9.0).build(),
				CycleTimeInfo.builder().column(UNKNOWN).day(5.0).build(),
				CycleTimeInfo.builder().column("BLOCK").day(6.0).build());
	}

	public static JiraBoardSetting.JiraBoardSettingBuilder JIRA_BOARD_SETTING_WITH_HISTORICAL_ASSIGNEE_FILTER_METHOD() {
		return JiraBoardSetting.builder()
			.boardId(BOARD_ID)
			.boardColumns(List.of(RequestJiraBoardColumnSetting.builder().name(ANALYSE).value(ANALYSE).build(),
					RequestJiraBoardColumnSetting.builder().name(IN_DEV).value(IN_DEV).build(),
					RequestJiraBoardColumnSetting.builder()
						.name(WAITING_FOR_TESTING)
						.value(WAITING_FOR_TESTING)
						.build(),
					RequestJiraBoardColumnSetting.builder().name(BLOCK).value(BLOCK).build(),
					RequestJiraBoardColumnSetting.builder().name(TESTING).value(TESTING).build(),
					RequestJiraBoardColumnSetting.builder().name(REVIEW).value(REVIEW).build(),
					RequestJiraBoardColumnSetting.builder().name(FLAG).value(FLAG).build(),
					RequestJiraBoardColumnSetting.builder().name(UNKNOWN).value(UNKNOWN).build()))
			.token("token")
			.site("site")
			.doneColumn(List.of("DONE"))
			.treatFlagCardAsBlock(true)
			.type("jira")
			.projectKey("PLL")
			.assigneeFilter("historicalAssignee")
			.users(List.of(DISPLAY_NAME_ONE))
			.targetFields(List.of(TargetField.builder().key("testKey1").name("Story Points").flag(true).build(),
					TargetField.builder().key("testKey2").name("Sprint").flag(true).build(),
					TargetField.builder().key("testKey3").name("Flagged").flag(true).build()));
	}

	public static StoryPointsAndCycleTimeRequest.StoryPointsAndCycleTimeRequestBuilder STORY_POINTS_REQUEST_WITH_ASSIGNEE_FILTER_METHOD() {
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_WITH_HISTORICAL_ASSIGNEE_FILTER_METHOD().build();
		return StoryPointsAndCycleTimeRequest.builder()
			.token("token")
			.type(jiraBoardSetting.getType())
			.site(jiraBoardSetting.getSite())
			.project(jiraBoardSetting.getProjectKey())
			.boardId(jiraBoardSetting.getBoardId())
			.status(jiraBoardSetting.getDoneColumn())
			.startTime(START_TIME)
			.endTime(END_TIME)
			.targetFields(jiraBoardSetting.getTargetFields())
			.treatFlagCardAsBlock(jiraBoardSetting.getTreatFlagCardAsBlock());
	}

	public static StoryPointsAndCycleTimeRequest.StoryPointsAndCycleTimeRequestBuilder STORY_POINTS_REQUEST_WITH_MULTIPLE_REAL_DONE_STATUSES() {
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_WITH_HISTORICAL_ASSIGNEE_FILTER_METHOD().build();
		return StoryPointsAndCycleTimeRequest.builder()
			.token("token")
			.type(jiraBoardSetting.getType())
			.site(jiraBoardSetting.getSite())
			.project(jiraBoardSetting.getProjectKey())
			.boardId(jiraBoardSetting.getBoardId())
			.status(List.of(DONE, IN_DEV))
			.startTime(START_TIME)
			.endTime(END_TIME)
			.targetFields(jiraBoardSetting.getTargetFields())
			.treatFlagCardAsBlock(jiraBoardSetting.getTreatFlagCardAsBlock());
	}

	public static AllCardsResponseDTO.AllCardsResponseDTOBuilder ALL_DONE_CARDS_RESPONSE_FOR_ASSIGNEE_FILTER_TEST() {
		return AllCardsResponseDTO.builder()
			.total("3")
			.issues(List.of(
					new JiraCard("ADM-475",
							JiraCardField.builder()
								.assignee(new Assignee(DISPLAY_NAME_ONE))
								.status(new Status(CardStepsEnum.DONE.getValue()))
								.build()),
					new JiraCard("ADM-520",
							JiraCardField.builder()
								.assignee(null)
								.status(new Status(CardStepsEnum.DONE.getValue()))
								.build()),
					new JiraCard("ADM-524",
							JiraCardField.builder()
								.assignee(new Assignee(DISPLAY_NAME_TWO))
								.status(new Status(CardStepsEnum.DONE.getValue()))
								.build())));
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD1_HISTORY_FOR_HISTORICAL_ASSIGNEE_FILTER() {
		return CardHistoryResponseDTO.builder()
			.items(List.of(
					new HistoryDetail(TIMESTAMP_1, "status", new Status(TESTING), new Status(REVIEW),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_2, "status", new Status(DONE), new Status(TESTING),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_1, "assignee", new Status("yun"), new Status(null),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_3, "assignee", new Status("song"), new Status("yun"),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null)));
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD2_HISTORY_FOR_HISTORICAL_ASSIGNEE_FILTER() {
		return CardHistoryResponseDTO.builder()
			.items(List.of(
					new HistoryDetail(TIMESTAMP_1, "status", new Status(TESTING), new Status(REVIEW),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_2, "status", new Status(DONE), new Status(TESTING),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_1, "assignee", new Status("yun"), new Status(null),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_3, "assignee", new Status("kun"), new Status("yun"),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null)));
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD3_HISTORY_FOR_HISTORICAL_ASSIGNEE_FILTER() {
		return CardHistoryResponseDTO.builder()
			.items(List.of(
					new HistoryDetail(TIMESTAMP_1, "status", new Status(TESTING), new Status(REVIEW),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_2, "status", new Status(DONE), new Status(TESTING),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_1, "assignee", new Status("yun"), new Status(null),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_3, "assignee", new Status(null), new Status("yun"),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null)));
	}

	public static AllCardsResponseDTO.AllCardsResponseDTOBuilder ALL_DONE_CARDS_RESPONSE_FOR_MULTIPLE_STATUS() {
		return AllCardsResponseDTO.builder()
			.total("2")
			.issues(List.of(
					new JiraCard("ADM-475",
							JiraCardField.builder()
								.assignee(new Assignee(DISPLAY_NAME_ONE))
								.status(new Status(CardStepsEnum.DONE.getValue()))
								.build()),
					new JiraCard("ADM-524",
							JiraCardField.builder()
								.assignee(new Assignee(DISPLAY_NAME_TWO))
								.status(new Status(CardStepsEnum.DONE.getValue()))
								.build())));
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD1_HISTORY_FOR_MULTIPLE_STATUSES() {
		return CardHistoryResponseDTO.builder()
			.isLast(true)
			.items(List.of(
					new HistoryDetail(TIMESTAMP_1, "status", new Status(IN_DEV), new Status(ANALYSE),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_2, "status", new Status(TESTING), new Status(IN_DEV),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_4, "status", new Status(IN_DEV), new Status(TESTING),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_5, "status", new Status(REVIEW), new Status(IN_DEV),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_6, "status", new Status(IN_DEV), new Status(REVIEW),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_7, "status", new Status(IN_DEV), new Status(BLOCK),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null)));
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD1_HISTORY_FOR_MULTIPLE_STATUSES_WITH_FLAG() {
		return CardHistoryResponseDTO.builder()
			.isLast(true)
			.items(List.of(
					new HistoryDetail(TIMESTAMP_1, "status", new Status(IN_DEV), new Status(ANALYSE),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_2, "status", new Status(TESTING), new Status(IN_DEV),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_4, "customfield_10021", new Status("Impediment"), new Status(null),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), "Flagged"),
					new HistoryDetail(TIMESTAMP_5, "status", new Status(IN_DEV), new Status(TESTING),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), null),
					new HistoryDetail(TIMESTAMP_7, "customfield_10021", new Status(null), new Status("Impediment"),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), "Flagged"),
					new HistoryDetail(TIMESTAMP_8, "customfield_10021", new Status("Impediment"), new Status(null),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), "Flagged"),
					new HistoryDetail(TIMESTAMP_8, "customfield_10020", new Status("Impediment"), new Status(null),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), "story"),
					new HistoryDetail(TIMESTAMP_9, "customfield_10021", new Status(null), new Status("Impediment"),
							new HistoryDetail.Actor(DISPLAY_NAME_ONE), "Flagged")));

	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD2_HISTORY_FOR_MULTIPLE_STATUSES() {
		return CardHistoryResponseDTO.builder()
			.items(List.of(new HistoryDetail(TIMESTAMP_1, "status", new Status(TESTING), new Status(ANALYSE),
					new HistoryDetail.Actor(DISPLAY_NAME_ONE), null)));
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD3_HISTORY_FOR_MULTIPLE_STATUSES() {
		return CardHistoryResponseDTO.builder()
			.items(List.of(new HistoryDetail(TIMESTAMP_1, "status", new Status(IN_DEV), new Status(ANALYSE),
					new HistoryDetail.Actor(DISPLAY_NAME_ONE), null)));
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD_HISTORY_WITH_NO_STATUS_FIELD() {
		return CardHistoryResponseDTO.builder()
			.items(List.of(new HistoryDetail(2, "assignee", new Status("In Dev"), new Status("To do"), null, null),
					new HistoryDetail(TIMESTAMP_1, "customfield_10021", new Status("Impediment"), new Status(FLAG),
							null, null),
					new HistoryDetail(TIMESTAMP_2, "flagged", new Status("Impediment"), new Status("removeFlag"), null,
							null)));
	}


	public static List<RequestJiraBoardColumnSetting> MOCK_JIRA_BOARD_COLUMN_SETTING_LIST() {
		return List.of(RequestJiraBoardColumnSetting.builder().name(IN_DEV).value(IN_DEV).build(),
			RequestJiraBoardColumnSetting.builder().name(ANALYSE).value(ANALYSE).build(),
			RequestJiraBoardColumnSetting.builder()
				.name(WAITING_FOR_TESTING)
				.value(WAITING_FOR_TESTING)
				.build(),
			RequestJiraBoardColumnSetting.builder().name(BLOCK).value(BLOCK).build(),
			RequestJiraBoardColumnSetting.builder().name(TESTING).value(TESTING).build(),
			RequestJiraBoardColumnSetting.builder().name(DONE).value(DONE).build(),
			RequestJiraBoardColumnSetting.builder().name(REVIEW).value(REVIEW).build());
	}

}
