package heartbeat.util;

import heartbeat.controller.board.vo.StatusChangedArrayItem;

import java.util.List;

public class StatusChangedArrayItemsFixture {

	public static List<StatusChangedArrayItem> STATUS_CHANGED_ITEMS_LIST() {
		return List.of(StatusChangedArrayItem.builder().timestamp(1000000L).status("FLAG").build(),
				StatusChangedArrayItem.builder().timestamp(1100000L).status("removeFlag").build(),
				StatusChangedArrayItem.builder().timestamp(1200000L).status("UNKNOWN").build(),
				StatusChangedArrayItem.builder().timestamp(1300000L).status("FLAG").build(),
				StatusChangedArrayItem.builder().timestamp(1400000L).status("UNKNOWN").build(),
				StatusChangedArrayItem.builder().timestamp(1500000L).status("removeFlag").build());
	}

	public static List<StatusChangedArrayItem> STATUS_CHANGED_ITEMS_EXPECT_LIST() {
		return List.of(StatusChangedArrayItem.builder().timestamp(1000000L).status("FLAG").build(),
				StatusChangedArrayItem.builder().timestamp(1100000L).status("UNKNOWN").build(),
				StatusChangedArrayItem.builder().timestamp(1200000L).status("UNKNOWN").build(),
				StatusChangedArrayItem.builder().timestamp(1300000L).status("FLAG").build(),
				StatusChangedArrayItem.builder().timestamp(1500000L).status("UNKNOWN").build());

	}

}
