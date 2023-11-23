package heartbeat.util;

import org.apache.logging.log4j.util.Strings;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EncryptDecryptUtilTest {

	@InjectMocks
	EncryptDecryptUtil encryptDecryptUtil;

	@Test
	void shouldToFix() {
		String randomIv = encryptDecryptUtil.getRandomIv();
		String secretKey = encryptDecryptUtil.getSecretKey("");
		String encryptedData = encryptDecryptUtil.getEncryptedData("", "", "");
		String macBytes = encryptDecryptUtil.getMacBytes("", "");
		assertEquals(Strings.EMPTY, randomIv);
		assertEquals(Strings.EMPTY, secretKey);
		assertEquals(Strings.EMPTY, encryptedData);
		assertEquals(Strings.EMPTY, macBytes);
	}

}
