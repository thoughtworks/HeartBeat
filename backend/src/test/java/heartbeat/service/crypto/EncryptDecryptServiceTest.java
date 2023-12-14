package heartbeat.service.crypto;

import heartbeat.exception.DecryptDataOrPasswordWrongException;
import heartbeat.util.EncryptDecryptUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EncryptDecryptServiceTest {

	public static final String FAKE_IV = "b361141b5669f5dfd6d90033b2c4599c";

	public static final String FAKE_MAC_BYTES = "sB1sVkLLhugkOWPWlifN0HHfrjcRfxzimoenRrQEcmI=";

	public static final String FAKE_SECRET_KEY = "fakeSecretKey";

	public static final String FAKE_ENCRYPTED_DATA = "qAx5C94jxoBe7T";

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
		String fakeConfigData = "fakeConfigData";
		// when
		when(encryptDecryptUtil.getRandomIv()).thenReturn(FAKE_IV);
		when(encryptDecryptUtil.getSecretKey("fakePassword")).thenReturn(FAKE_SECRET_KEY);
		when(encryptDecryptUtil.getEncryptedData(FAKE_IV, FAKE_SECRET_KEY, fakeConfigData))
			.thenReturn(FAKE_ENCRYPTED_DATA);
		when(encryptDecryptUtil.getMacBytes(FAKE_SECRET_KEY, FAKE_IV + FAKE_ENCRYPTED_DATA)).thenReturn(FAKE_MAC_BYTES);
		// then
		String encryptedData = encryptDecryptService.encryptConfigData(fakeConfigData, "fakePassword");
		assertEquals(FAKE_IV + FAKE_ENCRYPTED_DATA + FAKE_MAC_BYTES, encryptedData);
	}

	@Test
	void shouldReturnConfigData() {
		// given
		String encryptedData = FAKE_IV + FAKE_ENCRYPTED_DATA + FAKE_MAC_BYTES;
		// when
		when(encryptDecryptUtil.getSecretKey("fakePassword")).thenReturn(FAKE_SECRET_KEY);
		when(encryptDecryptUtil.cutIvFromEncryptedData(encryptedData)).thenReturn(FAKE_IV);
		when(encryptDecryptUtil.cutDataFromEncryptedData(encryptedData)).thenReturn(FAKE_ENCRYPTED_DATA);
		when(encryptDecryptUtil.cutMacBytesFromEncryptedData(encryptedData)).thenReturn(FAKE_MAC_BYTES);
		when(encryptDecryptUtil.verifyMacBytes(FAKE_SECRET_KEY, FAKE_IV + FAKE_ENCRYPTED_DATA, FAKE_MAC_BYTES))
			.thenReturn(true);
		when(encryptDecryptUtil.getDecryptedData(FAKE_IV, FAKE_SECRET_KEY, FAKE_ENCRYPTED_DATA))
			.thenReturn("fakeConfigData");
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
		assertEquals(HttpStatus.BAD_REQUEST.value(), exception.getStatus());
		assertEquals("Invalid file", exception.getMessage());
	}

	@Test
	void shouldThrowExceptionWhenVerifyMacBytesIsFalse() {
		// given
		String encryptedData = FAKE_IV + FAKE_ENCRYPTED_DATA + FAKE_MAC_BYTES;
		// when
		when(encryptDecryptUtil.getSecretKey("fakePassword")).thenReturn(FAKE_SECRET_KEY);
		when(encryptDecryptUtil.cutIvFromEncryptedData(encryptedData)).thenReturn(FAKE_IV);
		when(encryptDecryptUtil.cutDataFromEncryptedData(encryptedData)).thenReturn(FAKE_ENCRYPTED_DATA);
		when(encryptDecryptUtil.cutMacBytesFromEncryptedData(encryptedData)).thenReturn(FAKE_MAC_BYTES);
		when(encryptDecryptUtil.verifyMacBytes(FAKE_SECRET_KEY, FAKE_IV + FAKE_ENCRYPTED_DATA, FAKE_MAC_BYTES))
			.thenReturn(false);
		// then
		var exception = assertThrows(DecryptDataOrPasswordWrongException.class,
				() -> encryptDecryptService.decryptConfigData(encryptedData, "fakePassword"));
		assertEquals(HttpStatus.BAD_REQUEST.value(), exception.getStatus());
		assertEquals("Invalid file", exception.getMessage());
	}

}
