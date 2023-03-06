package heartbeat.service.jira;

import heartbeat.client.dto.*;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

public class JiraBoardConfigDTOFixture {

	public static final String BOARD_ID = "123";

	public static final String BOARD_NAME = "jira";

	public static final String COLUM_SELF_ID_1 = "1";

	public static final String COLUM_SELF_ID_2 = "2";

	public static JiraBoardConfigDTO.JiraBoardConfigDTOBuilder JIRA_BOARD_CONFIG_RESPONSE_BUILDER() {

		return JiraBoardConfigDTO.builder().id(BOARD_ID).name(BOARD_NAME).columnConfig(JiraColumnConfig.builder()
				.columns(List.of(JiraColumn.builder().name("TODO")
						.statuses(List.of(new JiraColumnStatus(COLUM_SELF_ID_1), new JiraColumnStatus(COLUM_SELF_ID_2)))
						.build()))
				.build());
	}

	public static StatusSelfDTO.StatusSelfDTOBuilder DONE_STATUS_SELF_RESPONSE_BUILDER() {
		return StatusSelfDTO.builder().untranslatedName("done").statusCategory(new StatusCategory("done", "done"));
	}

	public static StatusSelfDTO.StatusSelfDTOBuilder DOING_STATUS_SELF_RESPONSE_BUILDER() {
		return StatusSelfDTO.builder().untranslatedName("doing").statusCategory(new StatusCategory("doing", "doing"));
	}

	public static AllDoneCardsResponseDTO.AllDoneCardsResponseDTOBuilder ALL_DONE_CARDS_RESPONSE_BUILDER() {
		return AllDoneCardsResponseDTO.builder().total("2")
				.issues(List.of(new DoneCard("1", new DoneCardFields(new Assignee("Zhang San")))));
	}

	public static AllDoneCardsResponseDTO.AllDoneCardsResponseDTOBuilder ONE_PAGE_NO_DONE_CARDS_RESPONSE_BUILDER() {
		return AllDoneCardsResponseDTO.builder().total("1").issues(Collections.emptyList());
	}

	public static CardHistoryResponseDTO.CardHistoryResponseDTOBuilder CARD_HISTORY_RESPONSE_BUILDER() {
		return CardHistoryResponseDTO.builder().items(List.of(new Item("assignee", new To("San Zhang"))));
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

}
