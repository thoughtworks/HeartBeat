package heartbeat.controller.board.vo.response;

import lombok.Data;

import java.util.List;

@Data
public class CardHistoryResponse {

	private List<Item> items;
}
