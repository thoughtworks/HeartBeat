package heartbeat.service.crypto;

import heartbeat.util.EncryptDecryptUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EncryptDecryptServiceTest {

	@Mock
	EncryptDecryptUtil encryptDecryptUtil;

	EncryptDecryptService encryptDecryptService;

	@BeforeEach
	public void setUp() {
		encryptDecryptService = new EncryptDecryptService(encryptDecryptUtil);
	}

	@Test
	void shouldReturnEncryptConfigData() {
		// given
		String fakeSecretKey = "fakeSecretKey";
		String fakeEncryptedData = "fakeEncryptedData";
		String fakeConfigData = "fakeConfigData";
		String fakeMacBytes = "fakeMacBytes";
		String fakeIv = "fakeIv";
		// when
		when(encryptDecryptUtil.getRandomIv()).thenReturn(fakeIv);
		when(encryptDecryptUtil.getSecretKey("fakePassword")).thenReturn(fakeSecretKey);
		when(encryptDecryptUtil.getEncryptedData(fakeIv, fakeSecretKey, fakeConfigData)).thenReturn(fakeEncryptedData);
		when(encryptDecryptUtil.getMacBytes(fakeSecretKey, fakeEncryptedData)).thenReturn(fakeMacBytes);
		// then
		String encryptedData = encryptDecryptService.encryptConfigData(fakeConfigData, "fakePassword");
		assertEquals(fakeIv + fakeEncryptedData + fakeMacBytes, encryptedData);
	}

}
