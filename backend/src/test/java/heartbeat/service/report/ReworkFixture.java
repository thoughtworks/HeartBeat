package heartbeat.service.report;

import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.board.dto.response.ReworkTimesInfo;

import java.util.List;

import static heartbeat.controller.board.dto.request.CardStepsEnum.ANALYSE;
import static heartbeat.controller.board.dto.request.CardStepsEnum.BLOCK;
import static heartbeat.controller.board.dto.request.CardStepsEnum.DEVELOPMENT;
import static heartbeat.controller.board.dto.request.CardStepsEnum.DONE;
import static heartbeat.controller.board.dto.request.CardStepsEnum.REVIEW;
import static heartbeat.controller.board.dto.request.CardStepsEnum.TESTING;
import static heartbeat.controller.board.dto.request.CardStepsEnum.TODO;
import static heartbeat.controller.board.dto.request.CardStepsEnum.WAITING;

public class ReworkFixture {

	public static CardCollection MOCK_CARD_COLLECTION() {
		List<ReworkTimesInfo> reworkTimesInfos = List.of(ReworkTimesInfo.builder().state(ANALYSE).times(1).build(),
				ReworkTimesInfo.builder().state(DEVELOPMENT).times(1).build(),
				ReworkTimesInfo.builder().state(BLOCK).times(1).build(),
				ReworkTimesInfo.builder().state(WAITING).times(1).build(),
				ReworkTimesInfo.builder().state(REVIEW).times(1).build(),
				ReworkTimesInfo.builder().state(TESTING).times(1).build(),
				ReworkTimesInfo.builder().state(DONE).times(1).build());
		List<JiraCardDTO> jiraCardList = List.of(JiraCardDTO.builder().reworkTimesInfos(reworkTimesInfos).build(),
				JiraCardDTO.builder().reworkTimesInfos(reworkTimesInfos).build());
		return CardCollection.builder()
			.reworkCardNumber(2)
			.cardsNumber(2)
			.reworkRatio(1)
			.jiraCardDTOList(jiraCardList)
			.build();
	}

	public static CardCollection MOCK_CARD_COLLECTION_WITH_TODO() {
		List<ReworkTimesInfo> reworkTimesInfos = List.of(ReworkTimesInfo.builder().state(TODO).times(1).build(),
				ReworkTimesInfo.builder().state(DEVELOPMENT).times(1).build(),
				ReworkTimesInfo.builder().state(BLOCK).times(1).build(),
				ReworkTimesInfo.builder().state(WAITING).times(1).build(),
				ReworkTimesInfo.builder().state(REVIEW).times(1).build(),
				ReworkTimesInfo.builder().state(DONE).times(1).build());
		List<JiraCardDTO> jiraCardList = List.of(JiraCardDTO.builder().reworkTimesInfos(reworkTimesInfos).build(),
				JiraCardDTO.builder().reworkTimesInfos(reworkTimesInfos).build());
		return CardCollection.builder().reworkCardNumber(2).reworkRatio(1).jiraCardDTOList(jiraCardList).build();
	}

}
