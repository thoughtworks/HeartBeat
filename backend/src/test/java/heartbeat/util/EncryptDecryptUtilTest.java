package heartbeat.util;

import com.google.gson.Gson;
import heartbeat.exception.EncryptDecryptProcessException;
import heartbeat.service.report.MetricCsvFixture;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
		Map<String, String> withOutSalt = new HashMap<>();
		Map<String, String> withOutSecretKey = new HashMap<>();
		withOutSalt.put("BACKEND_SECRET_KEY", "fakeSecretKey");
		withOutSecretKey.put("FIXED_SALT", "fakeFixedSalt");
		when(systemUtil.getEnvMap()).thenReturn(withOutSalt).thenReturn(withOutSecretKey);
		var errMessageForWithOutSalt = assertThrows(EncryptDecryptProcessException.class,
				() -> encryptDecryptUtil.getSecretKey("fakePassword"));
		var errMessageForWithOutSecretKey = assertThrows(EncryptDecryptProcessException.class,
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
	void shouldThrowExceptionWhenGetEncryptedData() {
		// given
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv = encryptDecryptUtil.getRandomIv();
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey = encryptDecryptUtil.getSecretKey("fakePassword");
		// when
		var exception = assertThrows(EncryptDecryptProcessException.class,
				() -> encryptDecryptUtil.getEncryptedData(randomIv + randomIv, secretKey, jsonFakeData));
		// then
		assertEquals("Encrypted data failed", exception.getMessage());
		assertEquals(500, exception.getStatus());
	}

	@Test
	void shouldThrowExceptionWhenGetDecryptedData() {
		// given
		var fakeData = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();
		String jsonFakeData = new Gson().toJson(fakeData);
		String randomIv = encryptDecryptUtil.getRandomIv();
		when(systemUtil.getEnvMap()).thenReturn(envMap);
		String secretKey = encryptDecryptUtil.getSecretKey("fakePassword");
		// when
		var exception = assertThrows(EncryptDecryptProcessException.class,
				() -> encryptDecryptUtil.getDecryptedData(randomIv + randomIv, secretKey, jsonFakeData));
		// then
		assertEquals("Decrypted data failed", exception.getMessage());
		assertEquals(500, exception.getStatus());
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
		assertEquals(500, exception.getStatus());

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
		var exception = assertThrows(EncryptDecryptProcessException.class,
				() -> encryptDecryptUtil.verifyMacBytes("", encryptedData, ""));
		// then
		assertEquals("Obtain checksum algorithm in decrypt failed", exception.getMessage());
		assertEquals(500, exception.getStatus());

	}

	@Test
	void shouldCutDataCorrect() {
		// given
		String fakeIv = "b361141b5669f5dfd6d90033b2c4599c";
		String fakeEncryptedConfigData = "qAx5C94jxoBe7TkkegNvMMtbhaEHLrViQtIQvOv5RC3fDiXns4j0QqAiYEVKR40fLTRPXM9mp+aiJD/mplX1S2mkbQrGq2WdGYFRdXggnFb3xUvweoKzSe487aJmT9bsffNsVnjLMRcOyo16/nZJxHBaGAYxjuLI+/ZRZOfM7Lj0Iy2me2aC3jrvShuovpL6x4L87vt91z93T2XcoCRsWB4L9pq8+u+PvDZfkysMacI+QVOUoLmBynnmADRlPRqe9ec8X+YCTyFzCuvGNU9SyzRUr2mWMZ05lGZuiPkiD2vgRLI36DAExEmM/kHrv3jeTd4KvitzeNaK6ezTpPt3l0pMBkX91vgdgP520VkW+aWPIK75MMzm+/kAsmvqxLN+6QpbLAK6qrO9AswVG8zcRFqg1qcOs5WkB/41feF970+50cBHq4//SOg1cyy3kAC2jxF+5oiR5nFR1Zw7PotTqNWiGL6CkNP1FzbjpTZjb5cRqXl2X9KvuvJp/UKqF4bqKYkksAf8gC9OSJ09Sh8v/xgbxAvBB1A4fUtldvUdMCjy/5b7Vn/JKSoIT1CvZ1Jays1LWG2YURvY8aiQpCi0lR39ZvRnGYeYDGImVWloMbfXvXjdM6GfVQ99Z/87UAibKqRwf3wSgDvv6KMFDDHBXFQWMMHqTUYjRdSzqrSKmh2KpIh7efaawrAncr+tDapAOBm9+KCfSW6+y4efgj/sBg7m2OdU+dxzZ8ZfVyKVdhV5emoBFRKzdAOt//kUxbd4ie94EOp9L//xNI8+aMAyVh7wNpT8kuDOxlF5QqveUA6Fc0Bf1wG+koCB39zgzOTuWh7y3yj7wNODBYKrVyQYzX8gPzJAeikbvAEmWtc8lCF1JFiEdON2LzAcSr1mfuRmPyvWSOyZQZqOfmLZayY9i/HjTr3kZIvHx3WCH2qe14gh8H3JFnhw4UmJPf/OLRXHV3XZ8yK3PiDKjfzP9pR035mRwBJU18WHS5hHUhjc+/pobXpyzoTKB9gO7osnNIhwLguI2ZE40ctVcflzflqESEVWdPTLbBif+rEoFr9Oe6zEPh1JVOYvgJuehUuqrMA+8/6RDupZTcNdsU29sPAJ0F4tq7wyJQF8RjF27AfB8jpmfoHEC8gkh4UGkNyrg3Cfdgkg8CyhPaoDeZZ47pwVVXjS1uRnDJXTcVa4F8teX9TRugVPVt3C8Fc7OoBeFJqVxjZadvStkEwCL6Ippvk5YbhrzEXCgosdFqj9HNnEcnQDVY1u6/kfeCSuMB+u95oGbLhJGg34snFmJiZjBBcgkYSV9lSS6MRkoF6AjRZ/Y7JNzNvTFwr9aP0gMaBB9Cyre+95GHgpM9h8NZv7gNJWgr7FHulmg2QO0DaNsVKRJBTJ9oZ9uGOWpxfF3qACRK3i/NBhY7mfpzgNWAqHvN1kQvaPdkc1KwgXunejmG51kcj3VOS2Ir7vJMmWqg3iC0ojUwPZvo8S+HzByRNsiQU1PUxSU7u8yyTW6aI+DhNj1k2p3Rw+ag9I9oEmmtGAEz0GLTn7FgMwbGqGwsc+qwJX/OXjmi+lC53SWpSNyovjNMiqqJ+M/LCzq4z+DQek8TNZ+3/G1S6IOTcMbEyOxXPkdLaYsHX4G7DBgtoCsljdqtg+H+Aw5tyQW9Wsuf6nz6tK9f38Go1y59CLLNDzZma5pHFW9RH4yl8AjYywC7lJylCGtzr+IlsZE3Np/sPsxMIXw58teq1/zrm+dSNahWVoot0HwGbGEq+Ezg1/GLoBk5cfOUHoNo+/X7B67TLZ3v37ywkquuDddRhZp92yoUWZk+ojNW9IW1jxmmCoDpophtNPmhOOMa/Y+pFhe+cpZh8wQiB9la2XDqOoPYrI+caB/rmuIXSl9Aw6RMVYdMN9qM2Hs2bzrV8GaVzCg4sMC8eiGQCHbqVoHo0TqngdXakwlz7ZXhqd2VuX7JBW77vid+6sWVHYIHj1c+8MnomZIcJ/r0klwJD5mt1BVreJeE2E/IHLrDpMB2Pk+okLz121lVwQklH/pihGDUqjLejy6AotLfxCpiUEJ2m3C5rCY51TT3wYqGUs9j4SWiM2DaZJe4gv08fGAjgNjJdXxdwJKDXR281CBurlqkyEhv+9cGhCxXW7wxBP787SHw1aeAIB32xart5mUJQygvH8qkWYueHMvJdKY5FXKhSLStwtBsHL+l1+yQqPVT+kdpDLmfmpIrNQLgMByGAIO0F0uG5da/ecUciBmN97DDlRHTUS1EUG7rfv18Iw8FzplYEEQXhpOrie3rbzEtVZZLh5WZAk+MvWN3IHWMyo1QP5NAic41vO+eKVwdDwFyAEHP2RipeOX2ZLCu36YPbLA0UDzXJbSDyq9c4F6VtRiJAMiv9rFh3JAk0PPxqgQGqx8Iq2ZpMy+5JkdULiyqdK90SVgFk2y73QuLT2wR0B8PiApwnteQVKYwsfVnbTqIo3lg+SGTbcVc3xdoNZ2WyUrAyDCDAnjCjfmXynYXqmli9y7hVKWwiVkLd6MKOPKshSui9ZVbD3noOq6wbAnkIv2jYszPKRR48rUWyAMTCukl7UzjBszbV/tRrOgsZu0ryXqdbMjyfDyW0hZ0w6zoIX8wcSyR8l42jJx6BEzb67Iu9BsIJkpCdPuPOA1+7MUSl/0PN1lMRWgOfkaqRL8xYLEXaGaIX+x0ezMeXlkmxJq6bO/d/T4zhq3y2aVgNQcmjWTT3gSMV7ezL6icFbhmsYbFiJyBTdAnbPOeBzxzUzi8fdYCfLpsCbFcKPDh0uR4qJ9CJzPKtGBD+ldJrJZnxpZ6YO3T5sZan3cqs7yQXU=";
		String fakeMacBytes = "sB1sVkLLhugkOWPWlifN0HHfrjcRfxzimoenRrQEcmI=";
		String encryptedData = fakeIv + fakeEncryptedConfigData + fakeMacBytes;
		// when
		String iv = encryptDecryptUtil.cutIvFromEncryptedData(encryptedData);
		String encryptedConfigData = encryptDecryptUtil.cutDataFromEncryptedData(encryptedData);
		String macBytes = encryptDecryptUtil.cutMacBytesFromEncryptedData(encryptedData);
		// then
		assertEquals(fakeIv, iv);
		assertEquals(fakeEncryptedConfigData, encryptedConfigData);
		assertEquals(fakeMacBytes, macBytes);

	}

}
