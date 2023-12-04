package heartbeat.util;

import com.google.gson.Gson;
import heartbeat.exception.EncryptProcessException;
import heartbeat.service.report.MetricCsvFixture;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EncryptDecryptUtilTest {

	@InjectMocks
	EncryptDecryptUtil encryptDecryptUtil;

	@Mock
	SystemUtil systemUtil;

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

	@Test
	void shouldThrowExceptionWhenBackendSecretKeyOrFixedSaltIsNull() {
		Map<String, String> withOutSalt = new HashMap<>();
		Map<String, String> withOutSecretKey = new HashMap<>();
		withOutSalt.put("BACKEND_SECRET_KEY", "fakeSecretKey");
		withOutSecretKey.put("FIXED_SALT", "fakeFixedSalt");
		when(systemUtil.getEnvMap()).thenReturn(withOutSalt).thenReturn(withOutSecretKey);
		var errMessageForWithOutSalt = assertThrows(EncryptProcessException.class,
				() -> encryptDecryptUtil.getSecretKey("fakePassword"));
		var errMessageForWithOutSecretKey = assertThrows(EncryptProcessException.class,
				() -> encryptDecryptUtil.getSecretKey("fakePassword"));
		assertEquals("Get secret key failed with reason: No backend secret key or fixed salt in the environment",
				errMessageForWithOutSecretKey.getMessage());
		assertEquals(errMessageForWithOutSecretKey.getMessage(), errMessageForWithOutSalt.getMessage());
	}

	@Test
	void shouldGetRandomIv() {
		String randomIv1 = encryptDecryptUtil.getRandomIv();
		String randomIv2 = encryptDecryptUtil.getRandomIv();
		assertEquals(32, randomIv1.length());
		assertEquals(32, randomIv1.length());
		assertNotEquals(randomIv1, randomIv2);
	}

	@Test
	void shouldGetEncryptedData() {
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv1 = encryptDecryptUtil.getRandomIv();
		String randomIv2 = encryptDecryptUtil.getRandomIv();
		String encryptedData1 = encryptDecryptUtil.getEncryptedData(randomIv1,
				"67464eaa64b0719eecfa5380f8aba2c45ffc7de693fa7a6429f9c1312f005693", jsonFakeData);
		String encryptedData2 = encryptDecryptUtil.getEncryptedData(randomIv2,
				"67464eaa64b0719eecfa5380f8aba2c45ffc7de693fa7a6429f9c1312f005693", jsonFakeData);
		assertNotNull(encryptedData1);
		assertNotNull(encryptedData2);
		assertNotEquals(encryptedData1, encryptedData2);
	}

	@Test
	void shouldThrowExceptionWhenGetEncryptedData() {
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv = encryptDecryptUtil.getRandomIv();
		var exception = assertThrows(EncryptProcessException.class,
				() -> encryptDecryptUtil.getEncryptedData(randomIv + randomIv,
						"67464eaa64b0719eecfa5380f8aba2c45ffc7de693fa7a6429f9c1312f005693", jsonFakeData));
		assertEquals("Encrypted data failed", exception.getMessage());
		assertEquals(500, exception.getStatus());
	}

	@Test
	void shouldGetMacBytes() {
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv = encryptDecryptUtil.getRandomIv();
		String encryptedData = encryptDecryptUtil.getEncryptedData(randomIv,
				"67464eaa64b0719eecfa5380f8aba2c45ffc7de693fa7a6429f9c1312f005693", jsonFakeData);
		String macBytes = encryptDecryptUtil
			.getMacBytes("67464eaa64b0719eecfa5380f8aba2c45ffc7de693fa7a6429f9c1312f005693", encryptedData);
		assertNotNull(macBytes);

	}

	@Test
	void shouldThrowExceptionWhenGetMacBytes() {
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv = encryptDecryptUtil.getRandomIv();
		String encryptedData1 = encryptDecryptUtil.getEncryptedData(randomIv,
				"67464eaa64b0719eecfa5380f8aba2c45ffc7de693fa7a6429f9c1312f005693", jsonFakeData);
		var exception = assertThrows(EncryptProcessException.class,
				() -> encryptDecryptUtil.getMacBytes("", encryptedData1));
		assertEquals("Get macBytes failed", exception.getMessage());
		assertEquals(500, exception.getStatus());

	}

}
