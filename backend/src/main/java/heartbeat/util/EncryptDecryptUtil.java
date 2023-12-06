package heartbeat.util;

import heartbeat.exception.EncryptProcessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class EncryptDecryptUtil {

	public static final String SHA_256 = "SHA256";

	private static final String BACKEND_SECRET_KEY = "BACKEND_SECRET_KEY";

	private static final String FIXED_SALT = "FIXED_SALT";

	public static final String AES_CBC_PADDING = "AES/CBC/PKCS5Padding";

	public static final int RANDOM_IV_SIZE = 16;

	public final SystemUtil systemUtil;

	public String getRandomIv() {
		SecureRandom secureRandom = new SecureRandom();
		byte[] ivByteList = new byte[RANDOM_IV_SIZE];
		secureRandom.nextBytes(ivByteList);
		return convertHexadecimalString(ivByteList);
	}

	public String getSecretKey(String password) {
		Map<String, String> envMap = systemUtil.getEnvMap();

		try {
			if (Objects.isNull(envMap.get(BACKEND_SECRET_KEY)) || Objects.isNull(envMap.get(FIXED_SALT))) {
				throw new EncryptProcessException("No backend secret key or fixed salt in the environment");
			}
			String passwordWithSecretKeySalt = envMap.get(BACKEND_SECRET_KEY) + password + envMap.get(FIXED_SALT);
			MessageDigest sha256 = MessageDigest.getInstance(SHA_256);
			byte[] secretKeyByteList = sha256.digest(passwordWithSecretKeySalt.getBytes(StandardCharsets.UTF_8));
			return convertHexadecimalString(secretKeyByteList);
		}
		catch (Exception e) {
			throw new EncryptProcessException(String.format("Get secret key failed with reason: %s", e.getMessage()));
		}
	}

	public String getEncryptedData(String iv, String secretKey, String configData) {
		byte[] ivByteList = convertByteList(iv);
		byte[] secretKeyByteList = convertByteList(secretKey);
		byte[] configDataByteList = configData.getBytes(StandardCharsets.UTF_8);
		try {
			Cipher cipher = Cipher.getInstance(AES_CBC_PADDING);
			SecretKeySpec secretKeySpec = new SecretKeySpec(secretKeyByteList, "AES");
			IvParameterSpec ivParameterSpec = new IvParameterSpec(ivByteList);
			cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);
			return Base64.getEncoder().encodeToString(cipher.doFinal(configDataByteList));
		}
		catch (Exception e) {
			throw new EncryptProcessException("Encrypted data failed");
		}
	}

	public String getMacBytes(String secretKey, String encryptedData) {
		try {
			Mac sha256Hmac = Mac.getInstance("HmacSHA256");
			SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
			sha256Hmac.init(secretKeySpec);

			byte[] hmacData = sha256Hmac.doFinal(encryptedData.getBytes());
			return Base64.getEncoder().encodeToString(hmacData);
		}
		catch (Exception e) {
			throw new EncryptProcessException("Get macBytes failed");
		}
	}

	private String convertHexadecimalString(byte[] bytes) {
		return IntStream.range(0, bytes.length)
			.mapToObj(i -> String.format("%02x", 0xff & bytes[i]))
			.collect(Collectors.joining());
	}

	private byte[] convertByteList(String hexString) {
		int len = hexString.length();
		byte[] byteArray = new byte[len / 2];

		for (int i = 0; i < len; i += 2) {
			String byteString = hexString.substring(i, i + 2);
			byteArray[i / 2] = (byte) Integer.parseInt(byteString, 16);
		}

		return byteArray;
	}

}
