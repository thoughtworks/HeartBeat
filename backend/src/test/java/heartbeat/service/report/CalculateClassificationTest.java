package heartbeat.service.report;

import heartbeat.client.dto.board.jira.Assignee;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraCardFields;
import heartbeat.client.dto.board.jira.Status;
import heartbeat.controller.board.dto.request.Cards;
import heartbeat.controller.board.dto.response.*;
import heartbeat.controller.report.dto.response.Classification;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.*;

import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CalculateClassificationTest {

	@InjectMocks
	CalculateClassification calculateClassification;

	@Test
	void shouldReturnClassificationFields() throws IllegalAccessException {
		List<TargetField> expectTargetFields = List.of(
				TargetField.builder().key("priority").name("Priority").flag(true).build(),
				TargetField.builder().key("timetracking").name("Time tracking").flag(false).build(),
				TargetField.builder().key("sprint").name("Sprint").flag(false).build());

		List<JiraCardResponse> cards = Arrays.asList(JiraCardResponse.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardFields.builder()
					.assignee(Assignee.builder().displayName("value1").build())
					.summary("test")
					.issuetype(IssueType.builder().name("test").build())
					.reporter(Reporter.builder().displayName("Shawn").build())
					.statusCategoryChangeDate("test")
					.storyPoints(3)
					.fixVersions(List.of())
					.project(JiraProject.builder().build())
					.parent(CardParent.builder().build())
					.label("testLabel")
					.build())
				.build())
			.build());

		Cards expectCards = Cards.builder().cardsNumber(3).storyPointSum(3).jiraCardResponseList(cards).build();

		List<Classification> classifications = calculateClassification.calculateClassification(expectTargetFields,
				expectCards);

		assertEquals(1, classifications.size());

		Classification classification = classifications.get(0);
		assertEquals("Priority", classification.getFieldName());
	}


}
