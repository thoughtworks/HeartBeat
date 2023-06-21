package heartbeat.util;

import heartbeat.controller.board.dto.response.CycleTimeInfo;
import heartbeat.controller.board.dto.response.StatusChangedItem;
import heartbeat.service.report.WorkDay;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BoardUtilTest {

	public static final double EXPECT_DAYS = 4.0;

	@InjectMocks
	BoardUtil boardUtil;

	@Mock
	WorkDay workDay;

	@Test
	void shouldSortTimeLineAndRemoveItemBetweenFlagAndRemoveFlaggedWhenCallReformTimeLineForFlaggedCards() {
		List<StatusChangedItem> statusChangedItems = StatusChangedArrayItemsFixture.STATUS_CHANGED_ITEMS_LIST();
		List<StatusChangedItem> statusChangedItemsExpect = StatusChangedArrayItemsFixture
			.STATUS_CHANGED_ITEMS_EXPECT_LIST();

		List<StatusChangedItem> result = boardUtil.reformTimeLineForFlaggedCards(statusChangedItems);

		Assertions.assertEquals(statusChangedItemsExpect, result);

	}

	@Test
	void shouldReturnCardTimeForEachStep() {
		List<StatusChangedItem> statusChangedItems = StatusChangedArrayItemsFixture.STATUS_CHANGED_ITEMS_LIST();
		when(workDay.calculateWorkDaysBy24Hours(anyLong(), anyLong())).thenReturn(2.0);

		List<CycleTimeInfo> expect = List.of(CycleTimeInfo.builder().column("UNKNOWN").day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column("FLAG").day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column("REMOVEFLAG").day(EXPECT_DAYS).build());
		List<CycleTimeInfo> result = boardUtil.getCardTimeForEachStep(statusChangedItems);

		Assertions.assertEquals(expect, result);
	}

	@Test
	void shouldReturnNullWhenCallGetCardTimeForEachStepWithChangedItemIsEmpty() {
		List<StatusChangedItem> statusChangedItems = Collections.emptyList();

		List<CycleTimeInfo> result = boardUtil.getCardTimeForEachStep(statusChangedItems);

		Assertions.assertNull(result);
	}

}
