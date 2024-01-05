package heartbeat.controller.board.dto.request;

public class BoardVerifyRequestFixture {

	public static final String PROJECT_KEY = "ADM";

	public static BoardVerifyRequestParam.BoardVerifyRequestParamBuilder BOARD_VERIFY_REQUEST_BUILDER() {
		return BoardVerifyRequestParam.builder().boardId("unknown").site("site").token("token");
	}

}
