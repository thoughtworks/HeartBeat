package heartbeat.controller.board.dto.response;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraCardField;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.List;

public class JiraCardDTOTest {

	@Nested
	class GetTotalCycleTimeDivideStoryPoints {

		@Test
		void shouldReturnEmptyWhenBaseInfoIsNull() {
			assertEquals("",
					JiraCardDTO.builder()
						.cardCycleTime(CardCycleTime.builder().build())
						.cycleTime(List.of())
						.build()
						.getTotalCycleTimeDivideStoryPoints());
		}

		@Test
		void shouldReturnEmptyWhenCardCycleTimeIsNull() {
			assertEquals("",
					JiraCardDTO.builder()
						.cycleTime(List.of())
						.baseInfo(JiraCard.builder().build())
						.build()
						.getTotalCycleTimeDivideStoryPoints());
		}

		@Test
		void shouldReturnEmptyWhenNoFieldInBaseInfoIsNull() {
			assertEquals("",
					JiraCardDTO.builder()
						.cardCycleTime(CardCycleTime.builder().build())
						.cycleTime(List.of())
						.baseInfo(JiraCard.builder().build())
						.build()
						.getTotalCycleTimeDivideStoryPoints());
		}

		@Test
		void shouldReturnValueWhenStoryPointIsLargeThan0() {
			assertEquals("2.00",
					JiraCardDTO.builder()
						.cardCycleTime(CardCycleTime.builder().total(20.0d).build())
						.baseInfo(JiraCard.builder().fields(JiraCardField.builder().storyPoints(10d).build()).build())
						.build()
						.getTotalCycleTimeDivideStoryPoints());
		}

		@Test
		void shouldReturnEmptyWhenStoryPointIs0() {
			assertEquals("",
					JiraCardDTO.builder()
						.cardCycleTime(CardCycleTime.builder().total(0.0d).build())
						.baseInfo(JiraCard.builder().fields(JiraCardField.builder().storyPoints(0d).build()).build())
						.build()
						.getTotalCycleTimeDivideStoryPoints());
		}

	}

}
