package heartbeat.service.report.calculator;

import heartbeat.controller.board.dto.request.CardStepsEnum;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.report.dto.response.Rework;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@RequiredArgsConstructor
@Component
public class ReworkCalculator {

	public Rework calculateRework(CardCollection realDoneCardCollection, CardStepsEnum reworkState) {
		Rework rework = Rework.builder()
			.reworkState(reworkState.getValue())
			.reworkCardsRatio(realDoneCardCollection.getReworkRatio())
			.totalReworkCards(realDoneCardCollection.getReworkCardNumber())
			.throughput(realDoneCardCollection.getCardsNumber())
			.totalReworkTimes(0)
			.build();
		realDoneCardCollection.getJiraCardDTOList()
			.stream()
			.flatMap(jiraCardDTO -> jiraCardDTO.getReworkTimesInfos().stream())
			.forEach(reworkTimesInfo -> {
				Integer times = reworkTimesInfo.getTimes();
				switch (reworkTimesInfo.getState()) {
					case ANALYSE ->
						rework.setFromAnalysis(Optional.ofNullable(rework.getFromAnalysis()).orElse(0) + times);
					case DEVELOPMENT ->
						rework.setFromInDev(Optional.ofNullable(rework.getFromInDev()).orElse(0) + times);
					case BLOCK -> rework.setFromBlock(Optional.ofNullable(rework.getFromBlock()).orElse(0) + times);
					case WAITING -> rework.setFromWaitingForTesting(
							Optional.ofNullable(rework.getFromWaitingForTesting()).orElse(0) + times);
					case TESTING ->
						rework.setFromTesting(Optional.ofNullable(rework.getFromTesting()).orElse(0) + times);
					case REVIEW -> rework.setFromReview(Optional.ofNullable(rework.getFromReview()).orElse(0) + times);
					case DONE -> rework.setFromDone(Optional.ofNullable(rework.getFromDone()).orElse(0) + times);
					default -> throw new IllegalStateException("Unexpected value: " + reworkTimesInfo.getState());
				}
				rework.setTotalReworkTimes(rework.getTotalReworkTimes() + times);
			});
		return rework;
	}

}
