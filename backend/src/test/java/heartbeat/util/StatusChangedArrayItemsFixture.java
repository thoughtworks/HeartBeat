package heartbeat.util;

import heartbeat.controller.board.dto.response.StatusChangedItem;

import java.util.List;

public class StatusChangedArrayItemsFixture {

	public static List<StatusChangedItem> STATUS_CHANGED_ITEMS_LIST() {
		return List.of(StatusChangedItem.builder().timestamp(1000000L).status("FLAG").build(),
				StatusChangedItem.builder().timestamp(1100000L).status("removeFlag").build(),
				StatusChangedItem.builder().timestamp(1200000L).status("UNKNOWN").build(),
				StatusChangedItem.builder().timestamp(1300000L).status("FLAG").build(),
				StatusChangedItem.builder().timestamp(1400000L).status("UNKNOWN").build(),
				StatusChangedItem.builder().timestamp(1500000L).status("removeFlag").build());
	}

	public static List<StatusChangedItem> STATUS_CHANGED_ITEMS_EXPECT_LIST() {
		return List.of(StatusChangedItem.builder().timestamp(1000000L).status("FLAG").build(),
				StatusChangedItem.builder().timestamp(1100000L).status("UNKNOWN").build(),
				StatusChangedItem.builder().timestamp(1200000L).status("UNKNOWN").build(),
				StatusChangedItem.builder().timestamp(1300000L).status("FLAG").build(),
				StatusChangedItem.builder().timestamp(1500000L).status("UNKNOWN").build());

	}

}
