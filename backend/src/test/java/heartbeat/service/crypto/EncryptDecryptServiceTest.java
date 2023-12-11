package heartbeat.service.crypto;

import heartbeat.exception.DecryptDataOrPasswordWrongException;
import heartbeat.util.EncryptDecryptUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
		when(encryptDecryptUtil.getMacBytes(fakeSecretKey, fakeIv + fakeEncryptedData)).thenReturn(fakeMacBytes);
		// then
		String encryptedData = encryptDecryptService.encryptConfigData(fakeConfigData, "fakePassword");
		assertEquals(fakeIv + fakeEncryptedData + fakeMacBytes, encryptedData);
	}

	@Test
	void shouldReturnConfigData() {
		// given
		String fakeIv = "b361141b5669f5dfd6d90033b2c4599c";
		String fakeEncryptedData = "qAx5C94jxoBe7T";
		String fakeMacBytes = "sB1sVkLLhugkOWPWlifN0HHfrjcRfxzimoenRrQEcmI=";
		String encryptedData = fakeIv + fakeEncryptedData + fakeMacBytes;
		String fakeSecretKey = "fakeSecretKey";
		String fakeConfigData = "fakeConfigData";
		// when
		when(encryptDecryptUtil.getSecretKey("fakePassword")).thenReturn(fakeSecretKey);
		when(encryptDecryptUtil.cutIvFromEncryptedData(encryptedData)).thenReturn(fakeIv);
		when(encryptDecryptUtil.cutDataFromEncryptedData(encryptedData)).thenReturn(fakeEncryptedData);
		when(encryptDecryptUtil.cutMacBytesFromEncryptedData(encryptedData)).thenReturn(fakeMacBytes);
		when(encryptDecryptUtil.verifyMacBytes(fakeSecretKey, fakeIv + fakeEncryptedData, fakeMacBytes))
			.thenReturn(true);
		when(encryptDecryptUtil.getDecryptedData(fakeIv, fakeSecretKey, fakeEncryptedData)).thenReturn(fakeConfigData);
		// then
		String decryptedData = encryptDecryptService.decryptConfigData(encryptedData, "fakePassword");
		assertNotNull(decryptedData);
	}

	@Test
	void shouldThrowExceptionWhenEncryptedDataSizeTooShort() {
		// given
		String fakeIv = "b3";
		String fakeEncryptedData = "qA";
		String fakeMacBytes = "sB1sVk";
		String encryptedData = fakeIv + fakeEncryptedData + fakeMacBytes;
		// when
		when(encryptDecryptUtil.cutMacBytesFromEncryptedData(encryptedData))
			.thenThrow(new StringIndexOutOfBoundsException());
		// then
		var exception = assertThrows(DecryptDataOrPasswordWrongException.class,
				() -> encryptDecryptService.decryptConfigData(encryptedData, "fakePassword"));
		assertEquals(400, exception.getStatus());
		assertEquals("Invalid file", exception.getMessage());
	}

	@Test
	void shouldThrowExceptionWhenVerifyMacBytesIsFalse() {
		// given
		String fakeIv = "b361141b5669f5dfd6d90033b2c4599c";
		String fakeEncryptedData = "qAx5C94jxoBe";
		String fakeMacBytes = "sB1sVkLLhugkOWPWlifN0HHfrjcRfxzimoenRrQEcmI=";
		String encryptedData = fakeIv + fakeEncryptedData + fakeMacBytes;
		String fakeSecretKey = "fakeSecretKey";
		// when
		when(encryptDecryptUtil.getSecretKey("fakePassword")).thenReturn(fakeSecretKey);
		when(encryptDecryptUtil.cutIvFromEncryptedData(encryptedData)).thenReturn(fakeIv);
		when(encryptDecryptUtil.cutDataFromEncryptedData(encryptedData)).thenReturn(fakeEncryptedData);
		when(encryptDecryptUtil.cutMacBytesFromEncryptedData(encryptedData)).thenReturn(fakeMacBytes);
		when(encryptDecryptUtil.verifyMacBytes(fakeSecretKey, fakeIv + fakeEncryptedData, fakeMacBytes))
			.thenReturn(false);
		// then
		var exception = assertThrows(DecryptDataOrPasswordWrongException.class,
				() -> encryptDecryptService.decryptConfigData(encryptedData, "fakePassword"));
		assertEquals(400, exception.getStatus());
		assertEquals("Invalid file", exception.getMessage());
	}

}
