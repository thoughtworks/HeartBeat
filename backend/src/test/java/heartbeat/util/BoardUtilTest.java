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

import java.util.List;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BoardUtilTest {

	@InjectMocks
	BoardUtil boardUtil;

	@Mock
	WorkDay workDay;

	@Test
	void calculateCycleTimeOfRealDoneColumns() {
		List<StatusChangedItem> statusChangedItems = StatusChangedItemsListAndCycleTimeInfosListFixture
			.STATUS_CHANGED_ITEMS_LIST_OF_REAL_DONE_COLUMN();
		List<CycleTimeInfo> statusChangedItemsExpect = StatusChangedItemsListAndCycleTimeInfosListFixture
			.CYCLE_TIME_INFOS_LIST_OF_REAL_DONE_COLUMN();
		List<String> realDoneStatus = List.of("DONE");

		when(workDay.calculateWorkDaysBy24Hours(anyLong(), anyLong()))
			.thenReturn(StatusChangedItemsListAndCycleTimeInfosListFixture.EXPECT_DAYS);
		List<CycleTimeInfo> result = boardUtil.getCycleTimeInfos(statusChangedItems, realDoneStatus, true);
		Assertions.assertEquals(statusChangedItemsExpect, result);
	}

	@Test
	void calculateCycleTimeOfBlockColumn() {
		List<StatusChangedItem> statusChangedItems = StatusChangedItemsListAndCycleTimeInfosListFixture
			.STATUS_CHANGED_ITEMS_LIST_OF_BLOCK_COLUMN();
		List<CycleTimeInfo> statusChangedItemsExpect = StatusChangedItemsListAndCycleTimeInfosListFixture
			.CYCLE_TIME_INFOS_LIST_OF_BLOCK_COLUMN();
		List<String> realDoneStatus = List.of("DONE");

		when(workDay.calculateWorkDaysBy24Hours(anyLong(), anyLong()))
			.thenReturn(StatusChangedItemsListAndCycleTimeInfosListFixture.EXPECT_DAYS);
		List<CycleTimeInfo> result = boardUtil.getCycleTimeInfos(statusChangedItems, realDoneStatus, true);
		Assertions.assertEquals(statusChangedItemsExpect, result);
	}

	@Test
	void calculateCycleTimeOfOthersColumns() {
		List<StatusChangedItem> statusChangedItems = StatusChangedItemsListAndCycleTimeInfosListFixture
			.STATUS_CHANGED_ITEMS_LIST_OF_OTHER_COLUMN();
		List<CycleTimeInfo> statusChangedItemsExpect = StatusChangedItemsListAndCycleTimeInfosListFixture
			.CYCLE_TIME_INFOS_LIST_OF_OTHER_COLUMN();
		List<String> realDoneStatus = List.of("DONE");

		when(workDay.calculateWorkDaysBy24Hours(anyLong(), anyLong()))
			.thenReturn(StatusChangedItemsListAndCycleTimeInfosListFixture.EXPECT_DAYS);
		List<CycleTimeInfo> result = boardUtil.getCycleTimeInfos(statusChangedItems, realDoneStatus, true);
		Assertions.assertEquals(statusChangedItemsExpect, result);
	}

	@Test
	void calculateCycleTimeWhenTreatFlagCardAsBlockIsFalse() {
		List<StatusChangedItem> statusChangedItems = StatusChangedItemsListAndCycleTimeInfosListFixture
			.STATUS_CHANGED_ITEMS_LIST_WHEN_NOT_TREAT_FLAG_AS_BLOCK();
		List<CycleTimeInfo> statusChangedItemsExpect = StatusChangedItemsListAndCycleTimeInfosListFixture
			.CYCLE_TIME_INFOS_LIST_WHEN_NOT_TREAT_FLAG_AS_BLOCK();
		List<String> realDoneStatus = List.of("DONE");

		when(workDay.calculateWorkDaysBy24Hours(anyLong(), anyLong()))
			.thenReturn(StatusChangedItemsListAndCycleTimeInfosListFixture.EXPECT_DAYS);
		List<CycleTimeInfo> result = boardUtil.getCycleTimeInfos(statusChangedItems, realDoneStatus, false);
		Assertions.assertEquals(statusChangedItemsExpect, result);
	}

	@Test
	void shouldCalculateOriginCycleTimeGivenTreatFlagCardAsBlockIsTrue() {
		List<StatusChangedItem> statusChangedItems = StatusChangedItemsListAndCycleTimeInfosListFixture
			.STATUS_CHANGED_ITEMS_LIST_OF_ORIGIN();
		List<CycleTimeInfo> statusChangedItemsExpect = StatusChangedItemsListAndCycleTimeInfosListFixture
			.CYCLE_TIME_INFOS_LIST_OF_ORIGIN();

		when(workDay.calculateWorkDaysBy24Hours(anyLong(), anyLong()))
			.thenReturn(StatusChangedItemsListAndCycleTimeInfosListFixture.EXPECT_DAYS);

		List<CycleTimeInfo> result = boardUtil.getOriginCycleTimeInfos(statusChangedItems, Boolean.TRUE);
		Assertions.assertEquals(statusChangedItemsExpect, result);
	}

	@Test
	void shouldCalculateOriginCycleTimeGivenTreatFlagCardAsBlockIsFalse() {
		List<StatusChangedItem> statusChangedItems = StatusChangedItemsListAndCycleTimeInfosListFixture
			.STATUS_CHANGED_ITEMS_LIST_OF_ORIGIN();
		List<CycleTimeInfo> statusChangedItemsWithoutFlagExpect = StatusChangedItemsListAndCycleTimeInfosListFixture
			.CYCLE_TIME_INFOS_LIST_OF_ORIGIN_WITHOUT_FLAG();

		when(workDay.calculateWorkDaysBy24Hours(anyLong(), anyLong()))
			.thenReturn(StatusChangedItemsListAndCycleTimeInfosListFixture.EXPECT_DAYS);
		List<CycleTimeInfo> result = boardUtil.getOriginCycleTimeInfos(statusChangedItems, Boolean.FALSE);
		Assertions.assertEquals(statusChangedItemsWithoutFlagExpect, result);
	}

}
