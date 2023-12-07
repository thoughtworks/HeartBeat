package heartbeat.service.crypto;

import heartbeat.exception.DecryptDataOrPasswordException;
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
		when(encryptDecryptUtil.getMacBytes(fakeSecretKey, fakeEncryptedData)).thenReturn(fakeMacBytes);
		// then
		String encryptedData = encryptDecryptService.encryptConfigData(fakeConfigData, "fakePassword");
		assertEquals(fakeIv + fakeEncryptedData + fakeMacBytes, encryptedData);
	}

	@Test
	void shouldReturnConfigData() {
		// given
		String fakeIv = "b361141b5669f5dfd6d90033b2c4599c";
		String fakeEncryptedData = "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";
		String fakeMacBytes = "sB1sVkLLhugkOWPWlifN0HHfrjcRfxzimoenRrQEcmI=";
		String encryptedData = fakeIv + fakeEncryptedData + fakeMacBytes;
		String fakeSecretKey = "fakeSecretKey";
		String fakeConfigData = "fakeConfigData";
		// when
		when(encryptDecryptUtil.getSecretKey("fakePassword")).thenReturn(fakeSecretKey);
		when(encryptDecryptUtil.cutIvFromEncryptedData(encryptedData)).thenReturn(fakeIv);
		when(encryptDecryptUtil.cutDataFromEncryptedData(encryptedData)).thenReturn(fakeEncryptedData);
		when(encryptDecryptUtil.cutMacBytesFromEncryptedData(encryptedData)).thenReturn(fakeMacBytes);
		when(encryptDecryptUtil.verifyMacBytes(fakeSecretKey, fakeEncryptedData, fakeMacBytes)).thenReturn(true);
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
		var exception = assertThrows(DecryptDataOrPasswordException.class,
				() -> encryptDecryptService.decryptConfigData(encryptedData, "fakePassword"));
		assertEquals(400, exception.getStatus());
		assertEquals("Invalid file", exception.getMessage());
	}

	@Test
	void shouldThrowExceptionWhenVerifyMacBytesIsFalse() {
		// given
		String fakeIv = "b361141b5669f5dfd6d90033b2c4599c";
		String fakeEncryptedData = "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";
		String fakeMacBytes = "sB1sVkLLhugkOWPWlifN0HHfrjcRfxzimoenRrQEcmI=";
		String encryptedData = fakeIv + fakeEncryptedData + fakeMacBytes;
		String fakeSecretKey = "fakeSecretKey";
		// when
		when(encryptDecryptUtil.getSecretKey("fakePassword")).thenReturn(fakeSecretKey);
		when(encryptDecryptUtil.cutIvFromEncryptedData(encryptedData)).thenReturn(fakeIv);
		when(encryptDecryptUtil.cutDataFromEncryptedData(encryptedData)).thenReturn(fakeEncryptedData);
		when(encryptDecryptUtil.cutMacBytesFromEncryptedData(encryptedData)).thenReturn(fakeMacBytes);
		when(encryptDecryptUtil.verifyMacBytes(fakeSecretKey, fakeEncryptedData, fakeMacBytes)).thenReturn(false);
		// then
		var exception = assertThrows(DecryptDataOrPasswordException.class,
				() -> encryptDecryptService.decryptConfigData(encryptedData, "fakePassword"));
		assertEquals(400, exception.getStatus());
		assertEquals("Invalid file", exception.getMessage());
	}

}
