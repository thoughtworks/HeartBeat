package heartbeat.util;

import com.google.gson.Gson;
import heartbeat.exception.DecryptDataOrPasswordWrongException;
import heartbeat.exception.EncryptDecryptProcessException;
import heartbeat.service.report.MetricCsvFixture;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EncryptDecryptUtilTest {

	public static final String FAKE_IV = "b361141b5669f5dfd6d90033";

	public static final String FAKE_ENCRYPTED_CONFIG_DATA = "qAx5C94jxoBe7T";

	public static final String FAKE_MAC_BYTES = "sB1sVkLLhugkOWPWlifN0HHfrjcRfxzimoenRrQEcmI=";

	@InjectMocks
	EncryptDecryptUtil encryptDecryptUtil;

	@Mock
	SystemUtil systemUtil;

	private final Map<String, String> envMap = Map.of("BACKEND_SECRET_KEY", "fakeSecretKey", "FIXED_SALT",
			"fakeFixedSalt");

	@Test
	void shouldEncryptPasswordToSecretKeyBySha256() {
		when(systemUtil.getEnvMap()).thenReturn(envMap);

		String secretKey1 = encryptDecryptUtil.getSecretKey("fakePassword");
		String secretKey2 = encryptDecryptUtil.getSecretKey("Password");

		assertEquals(64, secretKey1.length());
		assertEquals(64, secretKey2.length());
	}

	@Test
	void shouldThrowExceptionWhenBackendSecretKeyOrFixedSaltIsNull() {
		// given
		Map<String, String> withOutSalt = new HashMap<>();
		Map<String, String> withOutSecretKey = new HashMap<>();
		withOutSalt.put("BACKEND_SECRET_KEY", "fakeSecretKey");
		withOutSecretKey.put("FIXED_SALT", "fakeFixedSalt");
		when(systemUtil.getEnvMap()).thenReturn(withOutSalt).thenReturn(withOutSecretKey);
		// when
		var errMessageForWithOutSalt = assertThrows(EncryptDecryptProcessException.class,
				() -> encryptDecryptUtil.getSecretKey("fakePassword"));
		var errMessageForWithOutSecretKey = assertThrows(EncryptDecryptProcessException.class,
				() -> encryptDecryptUtil.getSecretKey("fakePassword"));
		// then
		assertEquals("Get secret key failed with reason: No backend secret key or fixed salt in the environment",
				errMessageForWithOutSecretKey.getMessage());
		assertEquals(errMessageForWithOutSecretKey.getMessage(), errMessageForWithOutSalt.getMessage());
	}

	@Test
	void shouldGetRandomIv() {
		String randomIv1 = encryptDecryptUtil.getRandomIv();
		String randomIv2 = encryptDecryptUtil.getRandomIv();

		assertEquals(24, randomIv1.length());
		assertEquals(24, randomIv1.length());
		assertNotEquals(randomIv1, randomIv2);
	}

	@Test
	void shouldGetEncryptedData() {
		// given
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv1 = encryptDecryptUtil.getRandomIv();
		String randomIv2 = encryptDecryptUtil.getRandomIv();
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey = encryptDecryptUtil.getSecretKey("fakePassword");
		// when
		String encryptedData1 = encryptDecryptUtil.getEncryptedData(randomIv1, secretKey, jsonFakeData);
		String encryptedData2 = encryptDecryptUtil.getEncryptedData(randomIv2, secretKey, jsonFakeData);
		// then
		assertNotNull(encryptedData1);
		assertNotNull(encryptedData2);
		assertNotEquals(encryptedData1, encryptedData2);
	}

	@Test
	void shouldGetDecryptedData() {
		// given
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv = encryptDecryptUtil.getRandomIv();
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey = encryptDecryptUtil.getSecretKey("fakePassword");
		String encryptedData = encryptDecryptUtil.getEncryptedData(randomIv, secretKey, jsonFakeData);
		// when
		String configData = encryptDecryptUtil.getDecryptedData(randomIv, secretKey, encryptedData);
		// then
		assertEquals(jsonFakeData, configData);
	}

	@Test
	void shouldThrow500ExceptionWhenGetEncryptedData() {
		// given
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey = encryptDecryptUtil.getSecretKey("fakePassword");
		// when
		var exception = assertThrows(EncryptDecryptProcessException.class,
				() -> encryptDecryptUtil.getEncryptedData("", secretKey, jsonFakeData));
		// then
		assertEquals("Encrypted data failed", exception.getMessage());
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), exception.getStatus());
	}

	@Test
	void shouldThrow500ExceptionWhenGetDecryptedData() {
		// given
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey = encryptDecryptUtil.getSecretKey("fakePassword");
		// when
		var exception = assertThrows(EncryptDecryptProcessException.class,
				() -> encryptDecryptUtil.getDecryptedData("", secretKey, jsonFakeData));
		// then
		assertEquals("Decrypted data failed", exception.getMessage());
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), exception.getStatus());
	}

	@Test
	void shouldThrow401ExceptionWhenGetDecryptedDataWithPasswordWrong() {
		// given
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv = encryptDecryptUtil.getRandomIv();
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey = encryptDecryptUtil.getSecretKey("fakePassword");
		String encryptedData = encryptDecryptUtil.getEncryptedData(randomIv, secretKey, jsonFakeData);
		String wrongSecretKey = encryptDecryptUtil.getSecretKey("fakePassword1");
		// when
		var exception = assertThrows(DecryptDataOrPasswordWrongException.class,
				() -> encryptDecryptUtil.getDecryptedData(randomIv, wrongSecretKey, encryptedData));
		// then
		assertEquals("Incorrect password", exception.getMessage());
		assertEquals(HttpStatus.UNAUTHORIZED.value(), exception.getStatus());
	}

	@Test
	void shouldGetMacBytes() {
		// given
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv = encryptDecryptUtil.getRandomIv();
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey = encryptDecryptUtil.getSecretKey("fakePassword");

		String encryptedData = encryptDecryptUtil.getEncryptedData(randomIv, secretKey, jsonFakeData);
		// when
		String macBytes = encryptDecryptUtil.getMacBytes(secretKey, encryptedData);
		// then
		assertEquals(44, macBytes.length());
		assertNotNull(macBytes);

	}

	@Test
	void shouldReturnTrueWhenMacBytesIsSame() {
		// given
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv = encryptDecryptUtil.getRandomIv();
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey = encryptDecryptUtil.getSecretKey("fakePassword");

		String encryptedData = encryptDecryptUtil.getEncryptedData(randomIv, secretKey, jsonFakeData);
		String macBytes = encryptDecryptUtil.getMacBytes(secretKey, encryptedData);
		// when
		boolean verifyPass = encryptDecryptUtil.verifyMacBytes(secretKey, encryptedData, macBytes);
		// then
		assertTrue(verifyPass);

	}

	@Test
	void shouldReturnFalseWhenChangeEncryptedDataOrPasswordOrMacBytes() {
		// given
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv = encryptDecryptUtil.getRandomIv();
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey = encryptDecryptUtil.getSecretKey("fakePassword");

		String changedKey = secretKey.replace('a', 'b');
		String encryptedData = encryptDecryptUtil.getEncryptedData(randomIv, secretKey, jsonFakeData);
		String changedEncryptedData = encryptedData.replace('a', 'b');
		String macBytes = encryptDecryptUtil.getMacBytes(secretKey, encryptedData);
		String changedMacBytes = macBytes.toLowerCase();
		// when
		boolean verityChangeEncryptedData = encryptDecryptUtil.verifyMacBytes(secretKey, changedEncryptedData,
				macBytes);
		boolean verityChangeKey = encryptDecryptUtil.verifyMacBytes(changedKey, encryptedData, macBytes);
		boolean verityChangeMacBytes = encryptDecryptUtil.verifyMacBytes(secretKey, encryptedData, changedMacBytes);
		// then
		assertFalse(verityChangeEncryptedData);
		assertFalse(verityChangeKey);
		assertFalse(verityChangeMacBytes);

	}

	@Test
	void shouldThrowExceptionWhenGetMacBytes() {
		// given
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv = encryptDecryptUtil.getRandomIv();
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey = encryptDecryptUtil.getSecretKey("fakePassword");

		String encryptedData = encryptDecryptUtil.getEncryptedData(randomIv, secretKey, jsonFakeData);
		// when
		var exception = assertThrows(EncryptDecryptProcessException.class,
				() -> encryptDecryptUtil.getMacBytes("", encryptedData));
		// then
		assertEquals("Obtain checksum algorithm in encrypt failed", exception.getMessage());
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), exception.getStatus());

	}

	@Test
	void shouldThrowExceptionWhenVerityMacBytes() {
		// given
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv = encryptDecryptUtil.getRandomIv();
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey = encryptDecryptUtil.getSecretKey("fakePassword");

		String encryptedData = encryptDecryptUtil.getEncryptedData(randomIv, secretKey, jsonFakeData);
		// when
		var exception = assertThrows(DecryptDataOrPasswordWrongException.class,
				() -> encryptDecryptUtil.verifyMacBytes("", encryptedData, ""));
		var exception2 = assertThrows(EncryptDecryptProcessException.class,
				() -> encryptDecryptUtil.verifyMacBytes(null, encryptedData, ""));
		// then
		assertEquals("Invalid file", exception.getMessage());
		assertEquals(HttpStatus.BAD_REQUEST.value(), exception.getStatus());
		assertEquals("Obtain checksum algorithm in decrypt failed", exception2.getMessage());
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), exception2.getStatus());

	}

	@Test
	void shouldCutDataCorrect() {
		// given
		String encryptedData = FAKE_IV + FAKE_ENCRYPTED_CONFIG_DATA + FAKE_MAC_BYTES;
		// when
		String iv = encryptDecryptUtil.cutIvFromEncryptedData(encryptedData);
		String encryptedConfigData = encryptDecryptUtil.cutDataFromEncryptedData(encryptedData);
		String macBytes = encryptDecryptUtil.cutMacBytesFromEncryptedData(encryptedData);
		// then
		assertEquals(FAKE_IV, iv);
		assertEquals(FAKE_ENCRYPTED_CONFIG_DATA, encryptedConfigData);
		assertEquals(FAKE_MAC_BYTES, macBytes);

	}

}
