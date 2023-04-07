package heartbeat.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TokenUtilTest {

	@Test
	void shouldReturnTokenBeingMasked() {
		String mockToken = "1234ABCDE5678";
		String maskToken = TokenUtil.mask(mockToken);
		assertEquals("1234*****5678", maskToken);
	}

}
