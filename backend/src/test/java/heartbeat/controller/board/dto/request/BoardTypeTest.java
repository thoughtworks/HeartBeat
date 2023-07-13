package heartbeat.controller.board.dto.request;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class BoardTypeTest {

	@Test
	public void shouldConvertValueToType() {
		BoardType jiraBoardType = BoardType.fromValue("jira");
		BoardType classicJiraBoardType = BoardType.fromValue("classic-jira");
		BoardType linearBoardType = BoardType.fromValue("linear");
		assertEquals(jiraBoardType, BoardType.JIRA);
		assertEquals(classicJiraBoardType, BoardType.CLASSIC_JIRA);
		assertEquals(linearBoardType, BoardType.LINEAR);
	}

}
