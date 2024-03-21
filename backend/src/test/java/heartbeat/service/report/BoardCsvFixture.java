package heartbeat.service.report;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import heartbeat.client.dto.board.jira.Assignee;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraCardField;
import heartbeat.client.dto.board.jira.Sprint;
import heartbeat.client.dto.board.jira.Status;
import heartbeat.controller.board.dto.request.CardStepsEnum;
import heartbeat.controller.board.dto.response.CardCycleTime;
import heartbeat.controller.board.dto.response.CardParent;
import heartbeat.controller.board.dto.response.ColumnValue;
import heartbeat.controller.board.dto.response.CycleTimeInfo;
import heartbeat.controller.board.dto.response.Fields;
import heartbeat.controller.board.dto.response.FixVersion;
import heartbeat.controller.board.dto.response.IssueType;
import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.board.dto.response.JiraColumnDTO;
import heartbeat.controller.board.dto.response.JiraProject;
import heartbeat.controller.board.dto.response.Priority;
import heartbeat.controller.board.dto.response.Reporter;
import heartbeat.controller.board.dto.response.ReworkTimesInfo;
import heartbeat.controller.board.dto.response.StepsDay;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.report.dto.response.BoardCSVConfig;
import heartbeat.util.JsonFileReader;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

public class BoardCsvFixture {

	private static final BoardCSVConfig ISSUE_KEY_CONFIG = BoardCSVConfig.builder()
		.label("Issue key")
		.value("baseInfo.key")
		.originKey(null)
		.build();

	private static final BoardCSVConfig SUMMARY_CONFIG = BoardCSVConfig.builder()
		.label("Summary")
		.value("baseInfo.fields.summary")
		.originKey(null)
		.build();

	private static final BoardCSVConfig ISSUE_TYPE_CONFIG = BoardCSVConfig.builder()
		.label("Issue Type")
		.value("baseInfo.fields.issuetype.name")
		.originKey(null)
		.build();

	private static final BoardCSVConfig STATUS_CONFIG = BoardCSVConfig.builder()
		.label("Status")
		.value("baseInfo.fields.status.name")
		.originKey(null)
		.build();

	private static final BoardCSVConfig STATUS_DATE_CONFIG = BoardCSVConfig.builder()
		.label("Status Date")
		.value("baseInfo.fields.statuscategorychangedate")
		.originKey(null)
		.build();

	private static final BoardCSVConfig STORY_POINTS_CONFIG = BoardCSVConfig.builder()
		.label("Story Points")
		.value("baseInfo.fields.storyPoints")
		.originKey(null)
		.build();

	private static final BoardCSVConfig ASSIGNEE_CONFIG = BoardCSVConfig.builder()
		.label("assignee")
		.value("baseInfo.fields.assignee.displayName")
		.originKey(null)
		.build();

	private static final BoardCSVConfig REPORTER_CONFIG = BoardCSVConfig.builder()
		.label("Reporter")
		.value("baseInfo.fields.reporter.displayName")
		.originKey(null)
		.build();

	private static final BoardCSVConfig PROJECT_KEY_CONFIG = BoardCSVConfig.builder()
		.label("Project Key")
		.value("baseInfo.fields.project.key")
		.originKey(null)
		.build();

	private static final BoardCSVConfig PROJECT_NAME_CONFIG = BoardCSVConfig.builder()
		.label("Project Name")
		.value("baseInfo.fields.project.name")
		.originKey(null)
		.build();

	private static final BoardCSVConfig PRIORITY_CONFIG = BoardCSVConfig.builder()
		.label("Priority")
		.value("baseInfo.fields.priority.name")
		.originKey(null)
		.build();

	private static final BoardCSVConfig PARENT_SUMMARY_CONFIG = BoardCSVConfig.builder()
		.label("Parent Summary")
		.value("baseInfo.fields.parent.fields.summary")
		.originKey(null)
		.build();

	private static final BoardCSVConfig SPRINT_CONFIG = BoardCSVConfig.builder()
		.label("Sprint")
		.value("baseInfo.fields.sprint.name")
		.originKey(null)
		.build();

	private static final BoardCSVConfig LABELS_CONFIG = BoardCSVConfig.builder()
		.label("Labels")
		.value("baseInfo.fields.label")
		.originKey(null)
		.build();

	private static final BoardCSVConfig CYCLE_TIME_CONFIG = BoardCSVConfig.builder()
		.label("Cycle Time")
		.value("cardCycleTime.total")
		.originKey(null)
		.build();

	private static final BoardCSVConfig STORY_POINT_ESTIMATE_CONFIG = BoardCSVConfig.builder()
		.label("Story point estimate")
		.value("baseInfo.fields.customFields.customfield_1008")
		.originKey("customfield_1008")
		.build();

	private static final BoardCSVConfig CUSTOM_FIELD_1010_CONFIG = BoardCSVConfig.builder()
		.label("1010")
		.value("baseInfo.fields.customFields.customfield_1010")
		.originKey("customfield_1010")
		.build();

	private static final BoardCSVConfig CUSTOM_FIELD_1011_CONFIG = BoardCSVConfig.builder()
		.label("1011")
		.value("baseInfo.fields.customFields.customfield_1011")
		.originKey("customfield_1011")
		.build();

	private static final BoardCSVConfig CUSTOM_FIELD_10052_CONFIG = BoardCSVConfig.builder()
		.label("DevCommit")
		.value("baseInfo.fields.customFields.customfield_10052")
		.originKey("customfield_10052")
		.build();

	private static final BoardCSVConfig CUSTOM_FIELD_10053_CONFIG = BoardCSVConfig.builder()
		.label("10053")
		.value("baseInfo.fields.customFields.customfield_10053")
		.originKey("customfield_10053")
		.build();

	private static final BoardCSVConfig ORIGIN_CYCLE_BLOCKED_CONFIG = BoardCSVConfig.builder()
		.label("OriginCycleTime: BLOCKED")
		.value("cycleTimeFlat.BLOCKED")
		.originKey(null)
		.build();

	private static final BoardCSVConfig FLAGGED = BoardCSVConfig.builder()
		.label("Flagged")
		.value("baseInfo.fields.customFields.customfield_1001")
		.originKey("customfield_1001")
		.build();

	private static final BoardCSVConfig CYCLE_TIME_STORY_POINTS_CONFIG = BoardCSVConfig.builder()
		.label("Cycle Time / Story Points")
		.value("totalCycleTimeDivideStoryPoints")
		.originKey(null)
		.build();

	private static final BoardCSVConfig ANALYSIS_DAYS_CONFIG = BoardCSVConfig.builder()
		.label("Analysis Days")
		.value("cardCycleTime.steps.analyse")
		.originKey(null)
		.build();

	private static final BoardCSVConfig IN_DEV_DAYS_CONFIG = BoardCSVConfig.builder()
		.label("In Dev Days")
		.value("cardCycleTime.steps.development")
		.originKey(null)
		.build();

	private static final BoardCSVConfig WAITING_DAYS_CONFIG = BoardCSVConfig.builder()
		.label("Waiting Days")
		.value("cardCycleTime.steps.waiting")
		.originKey(null)
		.build();

	private static final BoardCSVConfig TESTING_DAYS_CONFIG = BoardCSVConfig.builder()
		.label("Testing Days")
		.value("cardCycleTime.steps.testing")
		.originKey(null)
		.build();

	private static final BoardCSVConfig BLOCK_DAYS_CONFIG = BoardCSVConfig.builder()
		.label("Block Days")
		.value("cardCycleTime.steps.blocked")
		.originKey(null)
		.build();

	private static final BoardCSVConfig REVIEW_DAYS_CONFIG = BoardCSVConfig.builder()
		.label("Review Days")
		.value("cardCycleTime.steps.review")
		.originKey(null)
		.build();

	private static final BoardCSVConfig ORIGIN_CYCLE_TIME_DOING_CONFIG = BoardCSVConfig.builder()
		.label("OriginCycleTime: DOING")
		.value("cycleTimeFlat.DOING")
		.originKey(null)
		.build();

	public static HashMap<String, JsonElement> CUSTOM_FIELDS = JsonFileReader
		.readJsonFile("./src/test/resources/fields.json");

	public static List<BoardCSVConfig> MOCK_FIXED_FIELDS() {
		return List.of(ISSUE_KEY_CONFIG, SUMMARY_CONFIG, ISSUE_TYPE_CONFIG, STATUS_CONFIG, STATUS_DATE_CONFIG,
				STORY_POINTS_CONFIG, ASSIGNEE_CONFIG, REPORTER_CONFIG, PROJECT_KEY_CONFIG, PROJECT_NAME_CONFIG,
				PRIORITY_CONFIG, PARENT_SUMMARY_CONFIG, SPRINT_CONFIG, LABELS_CONFIG, CYCLE_TIME_CONFIG,
				CYCLE_TIME_STORY_POINTS_CONFIG, ANALYSIS_DAYS_CONFIG, IN_DEV_DAYS_CONFIG, WAITING_DAYS_CONFIG,
				TESTING_DAYS_CONFIG, BLOCK_DAYS_CONFIG, REVIEW_DAYS_CONFIG, ORIGIN_CYCLE_TIME_DOING_CONFIG,
				ORIGIN_CYCLE_BLOCKED_CONFIG);
	}

	public static List<BoardCSVConfig> MOCK_EXTRA_FIELDS_WITH_CUSTOM() {
		return List.of(CUSTOM_FIELD_10052_CONFIG, CUSTOM_FIELD_10053_CONFIG);
	}

	public static List<BoardCSVConfig> MOCK_EXTRA_FIELDS() {
		return List.of(STORY_POINT_ESTIMATE_CONFIG, FLAGGED, CUSTOM_FIELD_1010_CONFIG, CUSTOM_FIELD_1011_CONFIG);
	}

	public static List<BoardCSVConfig> MOCK_ALL_FIELDS() {
		List<BoardCSVConfig> allFields = new ArrayList<>(MOCK_FIXED_FIELDS());
		allFields.addAll(MOCK_EXTRA_FIELDS());
		return allFields;
	}

	public static List<JiraCardDTO> MOCK_JIRA_CARD_DTO() {
		JiraCardField jiraCardField = MOCK_JIRA_CARD();

		HashMap<String, Double> cycleTimeFlat = new HashMap<>();
		cycleTimeFlat.put("DOING", 9.8067E-5);
		cycleTimeFlat.put("BLOCKED", null);

		CardCycleTime cardCycleTime = CardCycleTime.builder()
			.name("ADM-489")
			.total(0.90)
			.steps(StepsDay.builder().development(0.90).build())
			.build();
		JiraCardDTO jiraCardDTO = JiraCardDTO.builder()
			.baseInfo(JiraCard.builder().key("ADM-489").fields(jiraCardField).build())
			.cardCycleTime(cardCycleTime)
			.cycleTimeFlat(cycleTimeFlat)
			.totalCycleTimeDivideStoryPoints("0.90")
			.build();
		return List.of(jiraCardDTO);
	}

	public static JiraCardField MOCK_JIRA_CARD() {
		return JiraCardField.builder()
			.summary("summary")
			.issuetype(IssueType.builder().name("issue type").build())
			.status(Status.builder().displayValue("done").build())
			.lastStatusChangeDate(1701151323000L)
			.storyPoints(2)
			.assignee(Assignee.builder().displayName("name").build())
			.reporter(Reporter.builder().displayName("name").build())
			.project(JiraProject.builder().id("10001").key("ADM").name("Auto Dora Metrics").build())
			.priority(Priority.builder().name("Medium").build())
			.parent(CardParent.builder().fields(Fields.builder().summary("parent").build()).build())
			.sprint(Sprint.builder().name("sprint 1").build())
			.labels(Collections.emptyList())
			.customFields(CUSTOM_FIELDS)
			.build();
	}

	public static List<JiraCardDTO> MOCK_JIRA_CARD_DTO_WITH_EMPTY_BASE_INFO() {
		HashMap<String, Double> cycleTimeFlat = new HashMap<>();
		cycleTimeFlat.put("DONE", 16.0335);

		CardCycleTime cardCycleTime = CardCycleTime.builder()
			.name("ADM-489")
			.total(0.90)
			.steps(StepsDay.builder().development(0.90).build())
			.build();
		JiraCardDTO jiraCardDTO = JiraCardDTO.builder()
			.cardCycleTime(cardCycleTime)
			.cycleTimeFlat(cycleTimeFlat)
			.totalCycleTimeDivideStoryPoints("0.90")
			.build();
		return List.of(jiraCardDTO);
	}

	public static List<JiraCardDTO> MOCK_JIRA_CARD_DTO_WITH_BASE_INFO_CUSTOM_DATA() {
		JsonObject jsonObject = new JsonObject();
		jsonObject.addProperty("value", "dev");
		jsonObject.addProperty("ref", "red");

		JsonArray jsonArray = new JsonArray();
		jsonArray.add(jsonObject);

		HashMap<String, JsonElement> fields = new HashMap<String, JsonElement>();
		fields.put("customfield_10052", jsonObject);
		fields.put("customfield_10053", jsonArray);

		JiraCardField field = JiraCardField.builder()
			.summary("summary")
			.issuetype(IssueType.builder().name("issue type").build())
			.status(Status.builder().displayValue("done").build())
			.storyPoints(2)
			.lastStatusChangeDate(1701151323000L)
			.assignee(Assignee.builder().displayName("name").build())
			.reporter(Reporter.builder().displayName("name").build())
			.project(JiraProject.builder().id("10001").key("ADM").name("Auto Dora Metrics").build())
			.priority(Priority.builder().name("Medium").build())
			.parent(CardParent.builder().fields(Fields.builder().summary("parent").build()).build())
			.sprint(Sprint.builder().name("sprint 1").build())
			.labels(Collections.emptyList())
			.customFields(fields)
			.build();

		JiraCardDTO jiraCardDTO = JiraCardDTO.builder().baseInfo(JiraCard.builder().fields(field).build()).build();

		return List.of(jiraCardDTO);
	}

	public static List<JiraCardDTO> MOCK_JIRA_CARD_DTO_WITH_EMPTY_BASE_INFO_FIELDS() {
		HashMap<String, Double> cycleTimeFlat = new HashMap<>();
		cycleTimeFlat.put("DONE", 16.0335);

		CardCycleTime cardCycleTime = CardCycleTime.builder()
			.name("ADM-489")
			.total(0.90)
			.steps(StepsDay.builder().development(0.90).build())
			.build();
		JiraCardDTO jiraCardDTO = JiraCardDTO.builder()
			.baseInfo(JiraCard.builder().key("key").build())
			.cardCycleTime(cardCycleTime)
			.cycleTimeFlat(cycleTimeFlat)
			.totalCycleTimeDivideStoryPoints("0.90")
			.build();
		return List.of(jiraCardDTO);
	}

	public static List<JiraCardDTO> MOCK_JIRA_CARD_DTO_WITH_EMPTY_CARD_CYCLE_TIME() {
		HashMap<String, Double> cycleTimeFlat = new HashMap<>();
		cycleTimeFlat.put("DONE", 16.0335);
		JiraCardField jiraCardField = JiraCardField.builder()
			.summary("summary")
			.issuetype(IssueType.builder().name("任务").build())
			.status(Status.builder().displayValue("已完成").build())
			.lastStatusChangeDate(1701151323000L)
			.storyPoints(2)
			.project(JiraProject.builder().id("10001").key("ADM").name("Auto Dora Metrics").build())
			.priority(Priority.builder().name("Medium").build())
			.labels(Collections.emptyList())
			.build();

		JiraCardDTO jiraCardDTO = JiraCardDTO.builder()
			.baseInfo(JiraCard.builder().key("key").fields(jiraCardField).build())
			.cycleTimeFlat(cycleTimeFlat)
			.totalCycleTimeDivideStoryPoints("0.90")
			.build();
		return List.of(jiraCardDTO);
	}

	public static List<TargetField> MOCK_TARGET_FIELD_LIST() {
		return List.of(TargetField.builder().key("issuetype").name("事务类型").flag(true).build(),
				TargetField.builder().key("customfield_1001").name("1").flag(true).build(),
				TargetField.builder().key("customfield_1002").name("2").flag(true).build(),
				TargetField.builder().key("customfield_1003").name("3").flag(true).build(),
				TargetField.builder().key("customfield_1004").name("4").flag(true).build(),
				TargetField.builder().key("customfield_1005").name("5").flag(true).build(),
				TargetField.builder().key("customfield_1006").name("6").flag(true).build(),
				TargetField.builder().key("customfield_1007").name("7").flag(true).build(),
				TargetField.builder().key("customfield_1008").name("8").flag(true).build(),
				TargetField.builder().key("customfield_1009").name("9").flag(true).build(),
				TargetField.builder().key("customfield_1010").name("10").flag(true).build(),
				TargetField.builder().key("customfield_1011").name("11").flag(true).build(),
				TargetField.builder().key("customfield_1012").name("12").flag(true).build(),
				TargetField.builder().key("customfield_1013").name("13").flag(true).build(),
				TargetField.builder().key("customfield_1014").name("14").flag(true).build(),
				TargetField.builder().key("parent").name("父级").flag(false).build());
	}

	public static List<JiraCardDTO> MOCK_NON_DONE_CARD_LIST() {
		JsonObject jsonObject = new JsonObject();
		JsonArray jsonArray = new JsonArray();

		jsonObject.addProperty("key1", "value1");
		jsonObject.addProperty("key2", 123);

		jsonArray.add(jsonObject);

		CUSTOM_FIELDS.put("customfield_1012", new JsonPrimitive("test"));
		CUSTOM_FIELDS.put("customfield_1013", new JsonArray());
		CUSTOM_FIELDS.put("customfield_1014", jsonArray);

		List<JiraCardDTO> nonDoneCards = new ArrayList<>();
		nonDoneCards.add(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("1")
				.fields(JiraCardField.builder()
					.issuetype(IssueType.builder().name("缺陷").build())
					.status(Status.builder().name("Testing").build())
					.customFields(CUSTOM_FIELDS)
					.build())
				.build())
			.cardCycleTime(CardCycleTime.builder()
				.name("1")
				.steps(StepsDay.builder().development(0.0).build())
				.total(0.0)
				.build())
			.build());
		nonDoneCards.add(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("1")
				.fields(JiraCardField.builder()
					.issuetype(IssueType.builder().name("缺陷").build())
					.status(Status.builder().name("Review").build())
					.customFields(CUSTOM_FIELDS)
					.build())
				.build())
			.cardCycleTime(CardCycleTime.builder()
				.name("1")
				.steps(StepsDay.builder().development(0.0).build())
				.total(0.0)
				.build())
			.build());
		nonDoneCards.add(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("1")
				.fields(JiraCardField.builder()
					.issuetype(IssueType.builder().name("缺陷").build())
					.status(Status.builder().name("test").build())
					.customFields(CUSTOM_FIELDS)
					.build())
				.build())
			.cardCycleTime(CardCycleTime.builder()
				.name("1")
				.steps(StepsDay.builder().development(0.0).build())
				.total(0.0)
				.build())
			.build());
		nonDoneCards.add(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("1")
				.fields(JiraCardField.builder()
					.issuetype(IssueType.builder().name("缺陷").build())
					.customFields(CUSTOM_FIELDS)
					.build())
				.build())
			.cardCycleTime(CardCycleTime.builder()
				.name("1")
				.steps(StepsDay.builder().development(0.0).build())
				.total(0.0)
				.build())
			.build());
		return nonDoneCards;
	}

	public static List<JiraCardDTO> MOCK_DONE_CARD_LIST() {
		return List.of(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().displayName("Shawn").build())
					.summary("Tech replacement")
					.status(Status.builder().displayValue("Doing").build())
					.issuetype(IssueType.builder().name("Task").build())
					.reporter(Reporter.builder().displayName("Jack").build())
					.lastStatusChangeDate(1701151323000L)
					.storyPoints(3)
					.priority(Priority.builder().name("Top").build())
					.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
							FixVersion.builder().name("sprint2").build()))
					.project(JiraProject.builder().id("1").key("metrics").name("heartBeat").build())
					.parent(CardParent.builder().key("test").build())
					.labels(List.of("backend", "frontend"))
					.customFields(BoardCsvFixture.CUSTOM_FIELDS)
					.build())
				.build())
			.cardCycleTime(CardCycleTime.builder()
				.name("1")
				.steps(StepsDay.builder().development(0.9).build())
				.total(0.9)
				.build())
			.originCycleTime(List.of(CycleTimeInfo.builder().column("TODO").day(30.7859).build(),
					CycleTimeInfo.builder().column("DOING").day(3.29E-5).build()))
			.build());
	}

	public static List<JiraColumnDTO> MOCK_JIRA_COLUMN_LIST() {
		return List.of(
				JiraColumnDTO.builder()
					.key("正在进行")
					.value(ColumnValue.builder().name("Doing").statuses(List.of("DOING")).build())
					.build(),
				JiraColumnDTO.builder()
					.key("正在进行")
					.value(ColumnValue.builder().name("Testing").statuses(List.of("TESTING")).build())
					.build(),
				JiraColumnDTO.builder()
					.key("正在进行")
					.value(ColumnValue.builder().name("Review").statuses(List.of("REVIEW")).build())
					.build());
	}

	public static List<ReworkTimesInfo> MOCK_REWORK_TIMES_INFO_LIST() {
		return List.of(ReworkTimesInfo.builder().state(CardStepsEnum.BLOCK).times(2).build(),
				ReworkTimesInfo.builder().state(CardStepsEnum.REVIEW).times(0).build(),
				ReworkTimesInfo.builder().state(CardStepsEnum.WAITING).times(1).build(),
				ReworkTimesInfo.builder().state(CardStepsEnum.TESTING).times(0).build(),
				ReworkTimesInfo.builder().state(CardStepsEnum.DONE).times(0).build());
	}

}
