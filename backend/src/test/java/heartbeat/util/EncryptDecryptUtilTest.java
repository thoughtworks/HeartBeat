package heartbeat.util;

import org.apache.logging.log4j.util.Strings;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EncryptDecryptUtilTest {

	@InjectMocks
	EncryptDecryptUtil encryptDecryptUtil;

	@Mock
	SystemUtil systemUtil;

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

	@Test
	void shouldEncryptPasswordToSecretKeyBySha256() {
		Map<String, String> envMap = new HashMap<>();
		envMap.put("BACKEND_SECRET_KEY", "fakeSecretKey");
		envMap.put("FIXED_SALT", "fakeFixedSalt");
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey1 = encryptDecryptUtil.getSecretKey("fakePassword");
		String secretKey2 = encryptDecryptUtil.getSecretKey("Password");
		assertEquals(64, secretKey1.length());
		assertEquals(64, secretKey2.length());
	}

}
