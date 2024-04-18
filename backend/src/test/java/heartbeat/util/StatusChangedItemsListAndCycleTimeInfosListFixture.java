package heartbeat.util;

import heartbeat.controller.board.dto.response.CycleTimeInfo;
import heartbeat.controller.board.dto.response.StatusChangedItem;

import java.util.List;

public class StatusChangedItemsListAndCycleTimeInfosListFixture {

	public static double EXPECT_DAYS = 4.0;

	public static final String DONE = "DONE";

	public static final String BLOCK = "BLOCK";

	public static final String IN_PROGRESS = "IN PROGRESS";

	public static final String FLAG = "FLAG";

	public static List<StatusChangedItem> STATUS_CHANGED_ITEMS_LIST_OF_REAL_DONE_COLUMN() {
		return List.of(StatusChangedItem.builder().timestamp(1000000L).status("In Progress").build(),
				StatusChangedItem.builder().timestamp(2000000L).status("DONE").build(),
				StatusChangedItem.builder().timestamp(3000000L).status("FLAG").build(),
				StatusChangedItem.builder().timestamp(4000000L).status("removeFlag").build());
	}

	public static List<CycleTimeInfo> CYCLE_TIME_INFOS_LIST_OF_REAL_DONE_COLUMN() {
		return List.of(CycleTimeInfo.builder().column(DONE).day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column(IN_PROGRESS).day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column(FLAG).day(0.0).build());
	}

	public static List<StatusChangedItem> STATUS_CHANGED_ITEMS_LIST_OF_BLOCK_COLUMN() {
		return List.of(StatusChangedItem.builder().timestamp(1000000L).status("In Progress").build(),
				StatusChangedItem.builder().timestamp(2000000L).status("BLOCK").build(),
				StatusChangedItem.builder().timestamp(3000000L).status("FLAG").build(),
				StatusChangedItem.builder().timestamp(4000000L).status("removeFlag").build(),
				StatusChangedItem.builder().timestamp(5000000L).status("DONE").build());
	}

	public static List<CycleTimeInfo> CYCLE_TIME_INFOS_LIST_OF_BLOCK_COLUMN() {
		return List.of(CycleTimeInfo.builder().column(DONE).day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column(BLOCK).day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column(IN_PROGRESS).day(EXPECT_DAYS).build());
	}

	public static List<StatusChangedItem> STATUS_CHANGED_ITEMS_LIST_OF_OTHER_COLUMN() {
		return List.of(StatusChangedItem.builder().timestamp(1000000L).status("In Progress").build(),
				StatusChangedItem.builder().timestamp(2000000L).status("FLAG").build(),
				StatusChangedItem.builder().timestamp(3000000L).status("removeFlag").build(),
				StatusChangedItem.builder().timestamp(4000000L).status("BLOCK").build(),
				StatusChangedItem.builder().timestamp(5000000L).status("DONE").build());
	}

	public static List<CycleTimeInfo> CYCLE_TIME_INFOS_LIST_OF_OTHER_COLUMN() {
		return List.of(CycleTimeInfo.builder().column(DONE).day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column(BLOCK).day(8.0).build(),
				CycleTimeInfo.builder().column(IN_PROGRESS).day(0.0).build());
	}

	public static List<StatusChangedItem> STATUS_CHANGED_ITEMS_LIST_WHEN_NOT_TREAT_FLAG_AS_BLOCK() {
		return List.of(StatusChangedItem.builder().timestamp(1000000L).status("In Progress").build(),
				StatusChangedItem.builder().timestamp(2000000L).status("FLAG").build(),
				StatusChangedItem.builder().timestamp(3000000L).status("removeFlag").build(),
				StatusChangedItem.builder().timestamp(4000000L).status("BLOCK").build(),
				StatusChangedItem.builder().timestamp(5000000L).status("DONE").build());
	}

	public static List<CycleTimeInfo> CYCLE_TIME_INFOS_LIST_WHEN_NOT_TREAT_FLAG_AS_BLOCK() {
		return List.of(CycleTimeInfo.builder().column(DONE).day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column(BLOCK).day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column(IN_PROGRESS).day(EXPECT_DAYS).build());
	}

	public static List<StatusChangedItem> STATUS_CHANGED_ITEMS_LIST_OF_ORIGIN() {
		return List.of(StatusChangedItem.builder().timestamp(1000000L).status("In Progress").build(),
				StatusChangedItem.builder().timestamp(2000000L).status("FLAG").build(),
				StatusChangedItem.builder().timestamp(3000000L).status("removeFlag").build(),
				StatusChangedItem.builder().timestamp(4000000L).status("BLOCK").build(),
				StatusChangedItem.builder().timestamp(5000000L).status("DONE").build());
	}

	public static List<CycleTimeInfo> CYCLE_TIME_INFOS_LIST_OF_ORIGIN() {
		return List.of(CycleTimeInfo.builder().column(DONE).day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column(IN_PROGRESS).day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column(FLAG).day(EXPECT_DAYS).build());
	}

	public static List<CycleTimeInfo> CYCLE_TIME_INFOS_LIST_OF_ORIGIN_WITHOUT_FLAG() {
		return List.of(CycleTimeInfo.builder().column(DONE).day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column(BLOCK).day(EXPECT_DAYS).build(),
				CycleTimeInfo.builder().column(IN_PROGRESS).day(EXPECT_DAYS).build());
	}

}
