package heartbeat.service.report;

import com.google.gson.JsonPrimitive;
import heartbeat.client.dto.board.jira.Assignee;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraCardField;
import heartbeat.client.dto.board.jira.Status;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.CardParent;
import heartbeat.controller.board.dto.response.FixVersion;
import heartbeat.controller.board.dto.response.IssueType;
import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.board.dto.response.JiraProject;
import heartbeat.controller.board.dto.response.Priority;
import heartbeat.controller.board.dto.response.Reporter;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class ClassificationFixture {

	public static CardCollection GENERAL_CARD_COLLECTION = CardCollection.builder()
		.cardsNumber(4)
		.storyPointSum(3)
		.jiraCardDTOList(List.of(
				JiraCardDTO.builder()
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
							.customFields(Map.of("customfield_10015", new JsonPrimitive(42)))
							.build())
						.build())
					.build(),
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key2")
						.fields(JiraCardField.builder()
							.assignee(Assignee.builder().displayName("Tom").build())
							.summary("Tech replacement")
							.status(Status.builder().displayValue("Doing").build())
							.issuetype(IssueType.builder().name("Task").build())
							.reporter(Reporter.builder().displayName("Jack").build())
							.lastStatusChangeDate(1701151323000L)
							.storyPoints(3)
							.priority(Priority.builder().name("Medium").build())
							.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
									FixVersion.builder().name("sprint2").build()))
							.project(JiraProject.builder().id("1").key("metrics").name("heartBeat").build())
							.parent(CardParent.builder().key("ADM-442").build())
							.labels(List.of("backend", "frontend"))
							.customFields(Map.of("customfield_10015", new JsonPrimitive(42)))
							.build())
						.build())
					.build()))
		.build();

	public static CardCollection EMPTY_FIELDS_CARD_COLLECTION = CardCollection.builder()
		.cardsNumber(4)
		.storyPointSum(3)
		.jiraCardDTOList(List.of(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().build())
					.status(Status.builder().build())
					.issuetype(IssueType.builder().build())
					.reporter(Reporter.builder().build())
					.priority(Priority.builder().build())
					.fixVersions(List.of(FixVersion.builder().build(), FixVersion.builder().build()))
					.project(JiraProject.builder().build())
					.parent(CardParent.builder().build())
					.customFields(Collections.emptyMap())
					.build())
				.build())
			.build()))
		.build();

	public static CardCollection SAME_CONTENT_CARD_COLLECTION = CardCollection.builder()
		.cardsNumber(4)
		.storyPointSum(3)
		.jiraCardDTOList(List.of(
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key1")
						.fields(JiraCardField.builder()
							.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
									FixVersion.builder().name("sprint1").build()))
							.project(JiraProject.builder().id("1").key("metrics").name("heartBeat").build())
							.parent(CardParent.builder().key("test").build())
							.labels(List.of("bug"))
							.customFields(Map.of("customfield_10015", new JsonPrimitive(42)))
							.build())
						.build())
					.build(),
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key2")
						.fields(JiraCardField.builder()
							.fixVersions(List.of(FixVersion.builder().name("sprint2").build(),
									FixVersion.builder().name("sprint2").build()))
							.project(JiraProject.builder().id("1").key("metrics").name("heartBeat").build())
							.parent(CardParent.builder().key("test").build())
							.labels(List.of("bug"))
							.customFields(Map.of("customfield_10015", new JsonPrimitive(42)))
							.build())
						.build())
					.build()))
		.build();

	public static CardCollection CARD_COLLECTION_WITHOUT_NONE_KEY = CardCollection.builder()
		.cardsNumber(2)
		.storyPointSum(3)
		.jiraCardDTOList(List.of(
				JiraCardDTO.builder()
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
							.labels(List.of("bug"))
							.customFields(Map.of("customfield_10015", new JsonPrimitive(42)))
							.build())
						.build())
					.build(),
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key2")
						.fields(JiraCardField.builder()
							.assignee(Assignee.builder().displayName("Tom").build())
							.summary("Tech replacement")
							.status(Status.builder().displayValue("Doing").build())
							.issuetype(IssueType.builder().name("Task").build())
							.reporter(Reporter.builder().displayName("Jack").build())
							.lastStatusChangeDate(1701151323000L)
							.storyPoints(3)
							.priority(Priority.builder().name("Medium").build())
							.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
									FixVersion.builder().name("sprint2").build()))
							.project(JiraProject.builder().id("1").key("metrics").name("heartBeat").build())
							.parent(CardParent.builder().key("ADM-442").build())
							.labels(List.of("frontend"))
							.customFields(Map.of("customfield_10015", new JsonPrimitive(42)))
							.build())
						.build())
					.build()))
		.build();

	public static CardCollection CARD_COLLECTION_WITH_EMPTY_CONTENT = CardCollection.builder()
		.cardsNumber(2)
		.storyPointSum(3)
		.jiraCardDTOList(List.of(JiraCardDTO.builder()
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
					.fixVersions(List.of())
					.project(JiraProject.builder().id("1").key("metrics").name("heartBeat").build())
					.parent(CardParent.builder().key("test").build())
					.labels(List.of("bug"))
					.customFields(Map.of("customfield_10015", new JsonPrimitive(42)))
					.build())
				.build())
			.build()))
		.build();

}
