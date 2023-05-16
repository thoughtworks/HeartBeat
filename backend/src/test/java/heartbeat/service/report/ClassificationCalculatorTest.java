package heartbeat.service.report;

import heartbeat.client.dto.board.jira.Assignee;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraCardField;
import heartbeat.client.dto.board.jira.Status;
import heartbeat.controller.board.dto.response.*;
import heartbeat.controller.report.dto.response.Classification;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ClassificationCalculatorTest {

	@InjectMocks
	ClassificationCalculator classificationCalculator;

	@Test
	void shouldReturnClassificationFields() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("priority").name("Priority").flag(true).build(),
				TargetField.builder().key("timetracking").name("Time tracking").flag(false).build(),
				TargetField.builder().key("sprint").name("Sprint").flag(false).build());

		List<JiraCardDTO> mockJiraCards = List.of(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().displayName("value1").build())
					.summary("test")
					.issuetype(IssueType.builder().name("test").build())
					.reporter(Reporter.builder().displayName("Shawn").build())
					.statusCategoryChangeDate("test")
					.storyPoints(3)
					.priority(Priority.builder().name("Top").build())
					.fixVersions(List.of())
					.project(JiraProject.builder().build())
					.parent(CardParent.builder().build())
					.label("testLabel")
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(3)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields, mockCards);

		assertEquals(1, classifications.size());

		Classification classification = classifications.get(0);
		assertEquals("Priority", classification.getFieldName());
	}

	@Test
	void shouldReturnClassificationWithMapArrayFields() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("priority").name("Priority").flag(false).build(),
				TargetField.builder().key("fixVersions").name("Fix versions").flag(true).build(),
				TargetField.builder().key("sprint").name("Sprint").flag(false).build());

		List<JiraCardDTO> mockJiraCards = List.of(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().displayName("value1").build())
					.summary("test")
					.issuetype(IssueType.builder().name("test").build())
					.reporter(Reporter.builder().displayName("Shawn").build())
					.statusCategoryChangeDate("test")
					.storyPoints(3)
					.priority(Priority.builder().name("Top").build())
					.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
							FixVersion.builder().name("sprint2").build()))
					.project(JiraProject.builder().build())
					.parent(CardParent.builder().build())
					.label("testLabel")
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(5)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields, mockCards);

		assertEquals(1, classifications.size());

		Classification classification = classifications.get(0);
		assertEquals("Fix versions", classification.getFieldName());
		assertEquals("sprint1", classification.getPairList().get(0).getName());
		assertEquals(0.2, classification.getPairList().get(0).getValue());
		assertEquals("sprint2", classification.getPairList().get(1).getName());
		assertEquals(0.2, classification.getPairList().get(1).getValue());
	}

	@Test
	void shouldReturnClassificationWithPickRightDisplayName() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("assignee").name("Assignee").flag(true).build(),
				TargetField.builder().key("fixVersions").name("Fix versions").flag(false).build(),
				TargetField.builder().key("sprint").name("Sprint").flag(false).build(),
				TargetField.builder().key("reporter").name("Reporter").flag(true).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key1")
						.fields(JiraCardField.builder()
							.assignee(Assignee.builder().displayName("value1").build())
							.summary("test")
							.issuetype(IssueType.builder().name("test").build())
							.reporter(Reporter.builder().displayName("Shawn").build())
							.statusCategoryChangeDate("test")
							.storyPoints(3)
							.priority(Priority.builder().name("Top").build())
							.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
									FixVersion.builder().name("sprint2").build(),
									FixVersion.builder().name("sprint3").build(),
									FixVersion.builder().name("sprint4").build()))
							.project(JiraProject.builder().build())
							.parent(CardParent.builder().build())
							.label("testLabel")
							.build())
						.build())
					.build(),
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key1")
						.fields(JiraCardField.builder()
							.assignee(Assignee.builder().displayName("value2").build())
							.summary("test")
							.issuetype(IssueType.builder().name("test").build())
							.reporter(Reporter.builder().displayName("Shawn").build())
							.statusCategoryChangeDate("test")
							.storyPoints(3)
							.priority(Priority.builder().name("Top").build())
							.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
									FixVersion.builder().name("sprint2").build(),
									FixVersion.builder().name("sprint3").build(),
									FixVersion.builder().name("sprint4").build()))
							.project(JiraProject.builder().build())
							.parent(CardParent.builder().build())
							.label("testLabel")
							.build())
						.build())
					.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(2)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields, mockCards);

		assertEquals(2, classifications.size());

		assertEquals("Assignee", classifications.get(1).getFieldName());
		assertEquals("value2", classifications.get(1).getPairList().get(0).getName());
		assertEquals(0.5, classifications.get(1).getPairList().get(0).getValue());
		assertEquals("value1", classifications.get(1).getPairList().get(1).getName());
		assertEquals(0.5, classifications.get(1).getPairList().get(1).getValue());
		assertEquals("Reporter", classifications.get(0).getFieldName());
		assertEquals("Shawn", classifications.get(0).getPairList().get(0).getName());
		assertEquals(1.0, classifications.get(0).getPairList().get(0).getValue());
	}

	@Test
	void shouldReturnClassificationWithPickRightName() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("project").name("Project").flag(true).build(),
				TargetField.builder().key("issuetype").name("IssueType").flag(true).build(),
				TargetField.builder().key("fixVersions").name("Fix versions").flag(false).build(),
				TargetField.builder().key("assignee").name("Assignee").flag(true).build(),
				TargetField.builder().key("parent").name("Card Parent").flag(true).build());

		List<JiraCardDTO> mockJiraCards = List.of(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().displayName("value1").build())
					.summary("test")
					.issuetype(IssueType.builder().name("testIssue").build())
					.reporter(Reporter.builder().displayName("Shawn").build())
					.statusCategoryChangeDate("test")
					.storyPoints(3)
					.priority(Priority.builder().name("Top").build())
					.project(JiraProject.builder().id("001").key("project").name("heartBeat").build())
					.parent(CardParent.builder().name("ADM-442").build())
					.label("testLabel")
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(1)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields, mockCards);

		assertEquals(4, classifications.size());

		assertEquals("IssueType", classifications.get(0).getFieldName());
		assertEquals("testIssue", classifications.get(0).getPairList().get(0).getName());
		assertEquals(1.0, classifications.get(0).getPairList().get(0).getValue());
		assertEquals("Card Parent", classifications.get(1).getFieldName());
		assertEquals("ADM-442", classifications.get(1).getPairList().get(0).getName());
		assertEquals(1.0, classifications.get(1).getPairList().get(0).getValue());
		assertEquals("Assignee", classifications.get(3).getFieldName());
		assertEquals("value1", classifications.get(3).getPairList().get(0).getName());
		assertEquals(1.0, classifications.get(3).getPairList().get(0).getValue());
		assertEquals("Project", classifications.get(2).getFieldName());
		assertEquals("heartBeat", classifications.get(2).getPairList().get(0).getName());
		assertEquals(1.0, classifications.get(2).getPairList().get(0).getValue());

	}

	@Test
	void shouldReturnClassificationWithPickRightDisplayValue() {
		List<TargetField> mockTargetFields = List
			.of(TargetField.builder().key("status").name("Status").flag(true).build());

		List<JiraCardDTO> mockJiraCards = List.of(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.status(Status.builder().displayValue("testValue").build())
					.fixVersions(List.of(FixVersion.builder().build(), FixVersion.builder().build()))
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(1)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields, mockCards);

		assertEquals(1, classifications.size());
		assertEquals("Status", classifications.get(0).getFieldName());
		assertEquals("testValue", classifications.get(0).getPairList().get(0).getName());
	}

	@Test
	void shouldReturnClassificationWithString() {
		List<TargetField> mockTargetFields = List
			.of(TargetField.builder().key("label").name("Labels").flag(true).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key1")
						.fields(JiraCardField.builder()
							.status(Status.builder().displayValue("testValue").build())
							.fixVersions(List.of(FixVersion.builder().build(), FixVersion.builder().build()))
							.label("testLabel1")
							.build())
						.build())
					.build(),
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key1")
						.fields(JiraCardField.builder()
							.status(Status.builder().displayValue("testValue").build())
							.fixVersions(List.of(FixVersion.builder().build(), FixVersion.builder().build()))
							.label("testLabel2")
							.build())
						.build())
					.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(2)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields, mockCards);

		assertEquals(1, classifications.size());
		assertEquals("Labels", classifications.get(0).getFieldName());
		assertEquals("testLabel2", classifications.get(0).getPairList().get(0).getName());
		assertEquals(0.5, classifications.get(0).getPairList().get(0).getValue());
		assertEquals("testLabel1", classifications.get(0).getPairList().get(1).getName());
		assertEquals(0.5, classifications.get(0).getPairList().get(1).getValue());
	}

	@Test
	void shouldReturnNoneClassificationWithNoneTargetFields() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("project").name("Project").flag(false).build(),
				TargetField.builder().key("fixVersions").name("Fix versions").flag(false).build(),
				TargetField.builder().key("assignee").name("Assignee").flag(false).build());

		List<JiraCardDTO> mockJiraCards = List.of(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().displayName("value1").build())
					.summary("test")
					.issuetype(IssueType.builder().name("test").build())
					.reporter(Reporter.builder().displayName("Shawn").build())
					.statusCategoryChangeDate("test")
					.storyPoints(3)
					.priority(Priority.builder().name("Top").build())
					.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
							FixVersion.builder().name("sprint2").build(), FixVersion.builder().name("sprint3").build(),
							FixVersion.builder().name("sprint4").build()))
					.project(JiraProject.builder().id("001").key("project").name("heartBeat").build())
					.parent(CardParent.builder().build())
					.label("testLabel")
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(1)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields, mockCards);

		assertEquals(0, classifications.size());
	}

	@Test
	void shouldReturnNoneClassificationWithArrayObjIsNoneAndTargetFieldsIsNone() {
		List<TargetField> mockTargetFields = List
			.of(TargetField.builder().key("assignee").name("Assignee").flag(false).build());

		List<JiraCardDTO> mockJiraCards = List.of(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().build())
					.fixVersions(List.of(FixVersion.builder().build(), FixVersion.builder().build()))
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(1)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields, mockCards);

		assertEquals(0, classifications.size());
	}

	@Test
	void shouldReturnClassificationWithMapArrayFieldSameContent() {
		List<TargetField> mockTargetFields = List
			.of(TargetField.builder().key("fixVersions").name("Fix Versions").flag(true).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key1")
						.fields(JiraCardField.builder()
							.fixVersions(List.of(FixVersion.builder().name("version1").build(),
									FixVersion.builder().name("version1").build()))
							.build())
						.build())
					.build(),
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key2")
						.fields(JiraCardField.builder()
							.fixVersions(List.of(FixVersion.builder().name("version2").build(),
									FixVersion.builder().name("version2").build()))
							.build())
						.build())
					.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(2)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields, mockCards);

		assertEquals(1, classifications.size());
		assertEquals("Fix Versions", classifications.get(0).getFieldName());
		assertEquals("version2", classifications.get(0).getPairList().get(0).getName());
		assertEquals(1.0, classifications.get(0).getPairList().get(0).getValue());
		assertEquals("version1", classifications.get(0).getPairList().get(1).getName());
		assertEquals(1.0, classifications.get(0).getPairList().get(1).getValue());
	}

}
