package heartbeat.service.report;

import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.report.dto.response.CycleTime;
import heartbeat.controller.report.dto.response.CycleTimeForSelectedStepItem;
import heartbeat.service.report.calculator.CycleTimeCalculator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.List;

import static heartbeat.service.report.CycleTimeFixture.JIRA_BOARD_COLUMNS_SETTING;
import static heartbeat.service.report.CycleTimeFixture.JIRA_BOARD_COLUMNS_SETTING_WITH_MULTIPLE_STATUSES;
import static heartbeat.service.report.CycleTimeFixture.JIRA_BOARD_COLUMNS_SETTING_WITH_MULTIPLE_SWIM_LANES;
import static heartbeat.service.report.CycleTimeFixture.MOCK_CARD_COLLECTION;
import static heartbeat.service.report.CycleTimeFixture.MOCK_CARD_COLLECTION_COLUMN_WITH_MULTIPLE_STATUSES;
import static heartbeat.service.report.CycleTimeFixture.MOCK_CARD_COLLECTION_WITH_ZERO_VALUE;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CycleTimeCalculatorTest {

	@InjectMocks
	CycleTimeCalculator cycleTimeCalculator;

	@Test
	void shouldReturnAllDoneCardsCycleTimeWhenCallCalculateCycleTime() {
		CardCollection cardCollection = MOCK_CARD_COLLECTION();
		List<RequestJiraBoardColumnSetting> boardColumns = JIRA_BOARD_COLUMNS_SETTING();

		CycleTime cycleTimeExpect = CycleTime.builder()
			.totalTimeForCards(14.8)
			.averageCycleTimePerSP(4.93)
			.averageCycleTimePerCard(7.40)
			.swimlaneList(List.of(
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("In Dev")
						.averageTimeForSP(2.07)
						.averageTimeForCards(3.10)
						.totalTime(6.20)
						.build(),
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("Block")
						.averageTimeForSP(2.00)
						.averageTimeForCards(3.00)
						.totalTime(6.00)
						.build(),
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("Testing")
						.averageTimeForSP(0.87)
						.averageTimeForCards(1.30)
						.totalTime(2.60)
						.build()))
			.build();

		CycleTime cycleTimeActual = cycleTimeCalculator.calculateCycleTime(cardCollection, boardColumns);

		assertThat(cycleTimeActual).isEqualTo(cycleTimeExpect);
	}

	@Test
	void shouldReturnAllDoneCardsCycleTimeWhenCallCalculateCycleTimeWithZeroValue() {
		CardCollection cardCollection = MOCK_CARD_COLLECTION_WITH_ZERO_VALUE();
		List<RequestJiraBoardColumnSetting> boardColumns = JIRA_BOARD_COLUMNS_SETTING();

		CycleTime cycleTimeExpect = CycleTime.builder()
			.totalTimeForCards(4.3)
			.averageCycleTimePerSP(0.0)
			.averageCycleTimePerCard(0.0)
			.swimlaneList(List.of(
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("In Dev")
						.averageTimeForSP(0.0)
						.averageTimeForCards(0.0)
						.totalTime(0.0)
						.build(),
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("Block")
						.averageTimeForSP(0.0)
						.averageTimeForCards(0.0)
						.totalTime(3.0)
						.build(),
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("Testing")
						.averageTimeForSP(0.0)
						.averageTimeForCards(0.0)
						.totalTime(1.3)
						.build()))
			.build();

		CycleTime cycleTimeActual = cycleTimeCalculator.calculateCycleTime(cardCollection, boardColumns);

		assertThat(cycleTimeActual).isEqualTo(cycleTimeExpect);
	}

	@Test
	void shouldCalculateAllTheStatusesTogetherWhenCycleTimeColumnHasMultipleStatuses() {
		CardCollection cardCollection = MOCK_CARD_COLLECTION_COLUMN_WITH_MULTIPLE_STATUSES();
		List<RequestJiraBoardColumnSetting> boardColumns = JIRA_BOARD_COLUMNS_SETTING_WITH_MULTIPLE_STATUSES();

		CycleTime cycleTimeExpect = CycleTime.builder()
			.totalTimeForCards(6.9)
			.averageCycleTimePerSP(3.45)
			.averageCycleTimePerCard(6.9)
			.swimlaneList(List.of(
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("In Dev")
						.averageTimeForSP(1.3)
						.averageTimeForCards(2.6)
						.totalTime(2.6)
						.build(),
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("Block")
						.averageTimeForSP(1.5)
						.averageTimeForCards(3.0)
						.totalTime(3.0)
						.build(),
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("Testing")
						.averageTimeForSP(0.65)
						.averageTimeForCards(1.3)
						.totalTime(1.3)
						.build()))
			.build();

		CycleTime cycleTimeActual = cycleTimeCalculator.calculateCycleTime(cardCollection, boardColumns);

		assertThat(cycleTimeActual).isEqualTo(cycleTimeExpect);
	}

	@Test
	void shouldCalculateAllTheSwimLanesTogetherWhenCycleTimeMetricHasMultipleSwimLanes() {
		CardCollection cardCollection = MOCK_CARD_COLLECTION_COLUMN_WITH_MULTIPLE_STATUSES();
		List<RequestJiraBoardColumnSetting> boardColumns = JIRA_BOARD_COLUMNS_SETTING_WITH_MULTIPLE_SWIM_LANES();

		CycleTime cycleTimeExpect = CycleTime.builder()
			.totalTimeForCards(5.5)
			.averageCycleTimePerSP(2.75)
			.averageCycleTimePerCard(5.5)
			.swimlaneList(List.of(
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("In Dev")
						.averageTimeForSP(1.6)
						.averageTimeForCards(3.2)
						.totalTime(3.2)
						.build(),
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("Block")
						.averageTimeForSP(0.5)
						.averageTimeForCards(1.0)
						.totalTime(1.0)
						.build(),
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("Testing")
						.averageTimeForSP(0.65)
						.averageTimeForCards(1.3)
						.totalTime(1.3)
						.build()))
			.build();

		CycleTime cycleTimeActual = cycleTimeCalculator.calculateCycleTime(cardCollection, boardColumns);

		assertThat(cycleTimeActual).isEqualTo(cycleTimeExpect);
	}

}
