package heartbeat.util;

import heartbeat.controller.board.vo.StatusChangedArrayItem;
import heartbeat.controller.board.vo.response.CycleTimeInfo;
import heartbeat.service.report.WorkDay;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BoardUtilTest {

	@InjectMocks
	BoardUtil boardUtil;

	@Mock
	WorkDay workDay;

	@Mock
	TimeUtil timeUtil;

	@Test
	void shouldSortTimeLineAndRemoveItemBetweenFlagAndRemoveFlaggedWhenCallReformTimeLineForFlaggedCards() {
		List<StatusChangedArrayItem> statusChangedArrayItems = StatusChangedArrayItemsFixture
			.STATUS_CHANGED_ITEMS_LIST();
		List<StatusChangedArrayItem> statusChangedArrayItemsExpect = StatusChangedArrayItemsFixture
			.STATUS_CHANGED_ITEMS_EXPECT_LIST();

		List<StatusChangedArrayItem> result = boardUtil.reformTimeLineForFlaggedCards(statusChangedArrayItems);

		Assertions.assertEquals(statusChangedArrayItemsExpect, result);

	}

	@Test
	void testGetCardTimeForEachStep() {
		List<StatusChangedArrayItem> statusChangedArrayItems = StatusChangedArrayItemsFixture
			.STATUS_CHANGED_ITEMS_LIST();
		List<CycleTimeInfo> expect = List.of(CycleTimeInfo.builder().column("UNKNOWN").day(0.0).build(),
				CycleTimeInfo.builder().column("FLAG").day(0.0).build(),
				CycleTimeInfo.builder().column("REMOVEFLAG").day(0.0).build());
		List<CycleTimeInfo> result = boardUtil.getCardTimeForEachStep(statusChangedArrayItems);

		Assertions.assertEquals(expect, result);
	}

	@Test
	void shouldReturnWorkDays() {
		int index = 0;
		List<StatusChangedArrayItem> statusChangedArrayItems = StatusChangedArrayItemsFixture
			.STATUS_CHANGED_ITEMS_LIST();

		when(timeUtil.getCurrentTimeMillis()).thenReturn(1682233584698L);

		when(workDay.calculateWorkDaysBy24Hours(statusChangedArrayItems.get(index).getTimestamp(),
				statusChangedArrayItems.get(index + 1).getTimestamp()))
			.thenReturn(11.0);

		when(workDay.calculateWorkDaysBy24Hours(
				statusChangedArrayItems.get(statusChangedArrayItems.size() - 1).getTimestamp(),
				timeUtil.getCurrentTimeMillis()))
			.thenReturn(1.0);

		double result = boardUtil.getThisStepCostTime(index, statusChangedArrayItems);
		double result2 = boardUtil.getThisStepCostTime(statusChangedArrayItems.size() - 1, statusChangedArrayItems);

		Assertions.assertEquals(11.0, result);
		Assertions.assertEquals(1.0, result2);
	}

}
