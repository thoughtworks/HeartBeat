package heartbeat.service.report;

import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.report.dto.response.Classification;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

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

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields,
				ClassificationFixture.GENERAL_CARD_COLLECTION);

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

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields,
				ClassificationFixture.GENERAL_CARD_COLLECTION);

		assertEquals(1, classifications.size());

		Classification classification = classifications.get(0);
		assertEquals("Fix versions", classification.getFieldName());
		assertEquals("sprint1", classification.getPairList().get(0).getName());
		assertEquals(0.5, classification.getPairList().get(0).getValue());
		assertEquals("sprint2", classification.getPairList().get(1).getName());
		assertEquals(0.5, classification.getPairList().get(1).getValue());
	}

	@Test
	void shouldReturnClassificationWithPickRightDisplayName() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("assignee").name("Assignee").flag(true).build(),
				TargetField.builder().key("fixVersions").name("Fix versions").flag(false).build(),
				TargetField.builder().key("sprint").name("Sprint").flag(false).build(),
				TargetField.builder().key("reporter").name("Reporter").flag(true).build());

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields,
				ClassificationFixture.GENERAL_CARD_COLLECTION);

		assertEquals(2, classifications.size());

		assertEquals("Assignee", classifications.get(1).getFieldName());
		assertEquals("Shawn", classifications.get(1).getPairList().get(0).getName());
		assertEquals(0.25, classifications.get(1).getPairList().get(0).getValue());
		assertEquals("Tom", classifications.get(1).getPairList().get(1).getName());
		assertEquals(0.25, classifications.get(1).getPairList().get(1).getValue());
		assertEquals("Reporter", classifications.get(0).getFieldName());
		assertEquals("Jack", classifications.get(0).getPairList().get(0).getName());
		assertEquals(0.5, classifications.get(0).getPairList().get(0).getValue());
	}

	@Test
	void shouldReturnClassificationWithPickRightName() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("project").name("Project").flag(true).build(),
				TargetField.builder().key("issuetype").name("IssueType").flag(true).build(),
				TargetField.builder().key("fixVersions").name("Fix versions").flag(false).build(),
				TargetField.builder().key("assignee").name("Assignee").flag(true).build(),
				TargetField.builder().key("parent").name("Card Parent").flag(true).build());

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields,
				ClassificationFixture.GENERAL_CARD_COLLECTION);

		assertEquals(4, classifications.size());

		assertEquals("IssueType", classifications.get(0).getFieldName());
		assertEquals("Task", classifications.get(0).getPairList().get(0).getName());
		assertEquals(0.5, classifications.get(0).getPairList().get(0).getValue());
		assertEquals("Card Parent", classifications.get(1).getFieldName());
		assertEquals("test", classifications.get(1).getPairList().get(0).getName());
		assertEquals(0.25, classifications.get(1).getPairList().get(0).getValue());
		assertEquals("Assignee", classifications.get(3).getFieldName());
		assertEquals("Shawn", classifications.get(3).getPairList().get(0).getName());
		assertEquals(0.25, classifications.get(3).getPairList().get(0).getValue());
		assertEquals("Project", classifications.get(2).getFieldName());
		assertEquals("heartBeat", classifications.get(2).getPairList().get(0).getName());
		assertEquals(0.5, classifications.get(2).getPairList().get(0).getValue());

	}

	@Test
	void shouldReturnClassificationWithPickRightDisplayValue() {
		List<TargetField> mockTargetFields = List
			.of(TargetField.builder().key("status").name("Status").flag(true).build());

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields,
				ClassificationFixture.GENERAL_CARD_COLLECTION);

		assertEquals(1, classifications.size());
		assertEquals("Status", classifications.get(0).getFieldName());
		assertEquals("Doing", classifications.get(0).getPairList().get(0).getName());
	}

	@Test
	void shouldReturnClassificationWithString() {
		List<TargetField> mockTargetFields = List
			.of(TargetField.builder().key("label").name("Labels").flag(true).build());

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields,
				ClassificationFixture.GENERAL_CARD_COLLECTION);

		assertEquals(1, classifications.size());
		assertEquals("Labels", classifications.get(0).getFieldName());
		assertEquals("bug", classifications.get(0).getPairList().get(0).getName());
		assertEquals(0.25, classifications.get(0).getPairList().get(0).getValue());
		assertEquals("None", classifications.get(0).getPairList().get(1).getName());
		assertEquals(0.5, classifications.get(0).getPairList().get(1).getValue());
		assertEquals("frontend", classifications.get(0).getPairList().get(2).getName());
		assertEquals(0.25, classifications.get(0).getPairList().get(2).getValue());

	}

	@Test
	void shouldReturnNoneClassificationWithNoneTargetFields() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("project").name("Project").flag(false).build(),
				TargetField.builder().key("fixVersions").name("Fix versions").flag(false).build(),
				TargetField.builder().key("assignee").name("Assignee").flag(false).build());

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields,
				ClassificationFixture.GENERAL_CARD_COLLECTION);

		assertEquals(0, classifications.size());
	}

	@Test
	void shouldReturnNoneClassificationWithArrayObjIsNoneAndTargetFieldsIsNone() {
		List<TargetField> mockTargetFields = List
			.of(TargetField.builder().key("assignee").name("Assignee").flag(false).build());

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields,
				ClassificationFixture.EMPTY_FIELDS_CARD_COLLECTION);

		assertEquals(0, classifications.size());
	}

	@Test
	void shouldReturnNoneClassificationWithoutNoneKEY() {
		List<TargetField> mockTargetFields = List
			.of(TargetField.builder().key("assignee").name("Assignee").flag(true).build());

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields,
				ClassificationFixture.CARD_COLLECTION_WITHOUT_NONE_KEY);

		assertEquals(1, classifications.size());
		assertEquals("Assignee", classifications.get(0).getFieldName());
	}

	@Test
	void shouldReturnClassificationWithMapArrayFieldSameContent() {
		List<TargetField> mockTargetFields = List
			.of(TargetField.builder().key("fixVersions").name("Fix Versions").flag(true).build());

		List<Classification> classifications = classificationCalculator.calculate(mockTargetFields,
				ClassificationFixture.SAME_CONTENT_CARD_COLLECTION);

		assertEquals(1, classifications.size());
		assertEquals("Fix Versions", classifications.get(0).getFieldName());
		assertEquals("sprint1", classifications.get(0).getPairList().get(0).getName());
		assertEquals(0.5, classifications.get(0).getPairList().get(0).getValue());
		assertEquals("sprint2", classifications.get(0).getPairList().get(1).getName());
		assertEquals(0.5, classifications.get(0).getPairList().get(1).getValue());
	}

}
