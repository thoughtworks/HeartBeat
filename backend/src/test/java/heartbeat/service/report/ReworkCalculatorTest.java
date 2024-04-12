package heartbeat.service.report;

import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.report.dto.response.Rework;
import heartbeat.service.report.calculator.ReworkCalculator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import static heartbeat.controller.board.dto.request.CardStepsEnum.DEVELOPMENT;
import static heartbeat.service.report.ReworkFixture.MOCK_CARD_COLLECTION;
import static heartbeat.service.report.ReworkFixture.MOCK_CARD_COLLECTION_WITH_TODO;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ReworkCalculatorTest {

	@InjectMocks
	ReworkCalculator reworkCalculator;

	@Test
	void shouldReturnAllDoneCardsReworkTimesWhenCallCalculateRework() {
		Rework rework = reworkCalculator.calculateRework(MOCK_CARD_COLLECTION(), DEVELOPMENT);

		assertEquals(DEVELOPMENT.getValue(), rework.getReworkState());
		assertEquals(1, rework.getReworkCardsRatio());
		assertEquals(2, rework.getTotalReworkCards());
		assertEquals(2, rework.getFromAnalysis());
		assertEquals(2, rework.getFromInDev());
		assertEquals(2, rework.getFromBlock());
		assertEquals(2, rework.getFromWaitingForTesting());
		assertEquals(2, rework.getFromTesting());
		assertEquals(2, rework.getFromReview());
		assertEquals(2, rework.getFromDone());
		assertEquals(2, rework.getThroughput());
	}

	@Test
	void shouldThrowExceptionWhenCallCalculateReworkGivenCardCollectionHasAnalyseStateReworkTimesInfo() {
		CardCollection cardCollection = MOCK_CARD_COLLECTION_WITH_TODO();
		assertThrows(IllegalStateException.class, () -> reworkCalculator.calculateRework(cardCollection, DEVELOPMENT),
				"Unexpected value: TODO");
	}

}
