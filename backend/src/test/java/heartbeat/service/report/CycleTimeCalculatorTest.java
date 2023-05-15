package heartbeat.service.report;

import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.CycleTimeInfo;
import heartbeat.controller.board.dto.response.JiraCardDTO;
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

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CycleTimeCalculatorTest {

	@InjectMocks
	CycleTimeCalculator cycleTimeCalculator;

	@Test
	public void shouldReturnAllDoneCardsCycleTimeWhenCallCalculateCycleTime() {
		List<CycleTimeInfo> cycleTimeInfoList = List.of(CycleTimeInfo.builder().column("DOING").day(3.1).build(),
				CycleTimeInfo.builder().column("BLOCKED").day(2.0).build(),
				CycleTimeInfo.builder().column("FLAG").day(1.0).build(),
				CycleTimeInfo.builder().column("DONE").day(9.0).build(),
				CycleTimeInfo.builder().column("TESTING").day(1.3).build());
		List<JiraCardDTO> jiraCardList = List.of(JiraCardDTO.builder().cycleTime(cycleTimeInfoList).build(),
				JiraCardDTO.builder().cycleTime(cycleTimeInfoList).build());

		CardCollection cardCollection = CardCollection.builder()
			.storyPointSum(3)
			.cardsNumber(2)
			.jiraCardDTOList(jiraCardList)
			.build();
		List<RequestJiraBoardColumnSetting> boardColumns = List.of(
				RequestJiraBoardColumnSetting.builder().name("TODO").value("To do").build(),
				RequestJiraBoardColumnSetting.builder().name("Doing").value("In Dev").build(),
				RequestJiraBoardColumnSetting.builder().name("Blocked").value("Block").build(),
				RequestJiraBoardColumnSetting.builder().name("Testing").value("Testing").build(),
				RequestJiraBoardColumnSetting.builder().name("Done").value("Done").build());

		CycleTime cycleTimeExpect = CycleTime.builder()
			.totalTime(14.8)
			.averageCycleTimePerSP("4.93")
			.averageCircleTimePerCard("7.40")
			.cycleTimeForSelectedStepsList(List.of(
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("In Dev")
						.averageTimeForSP("2.07")
						.averageTimeForCards("3.10")
						.totalTime("6.20")
						.build(),
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("Block")
						.averageTimeForSP("2.00")
						.averageTimeForCards("3.00")
						.totalTime("6.00")
						.build(),
					CycleTimeForSelectedStepItem.builder()
						.optionalItemName("Testing")
						.averageTimeForSP("0.87")
						.averageTimeForCards("1.30")
						.totalTime("2.60")
						.build()))

			.build();

		CycleTime cycleTimeActual = cycleTimeCalculator.calculateCycleTime(cardCollection, boardColumns);

		assertThat(cycleTimeActual).isEqualTo(cycleTimeExpect);
	}

}
