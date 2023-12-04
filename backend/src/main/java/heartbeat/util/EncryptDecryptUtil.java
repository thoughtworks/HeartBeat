package heartbeat.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
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

	public final SystemUtil systemUtil;

	public String getSecretKey(String password) {
		Map<String, String> envMap = systemUtil.getEnvMap();
		if (Objects.isNull(envMap.get(BACKEND_SECRET_KEY)) || Objects.isNull(envMap.get(FIXED_SALT))) {
			throw new RuntimeException();
		}
		String passwordWithSecretKeySalt = envMap.get(BACKEND_SECRET_KEY) + password
				+ Objects.nonNull(envMap.get(FIXED_SALT));
		try {
			MessageDigest sha256 = MessageDigest.getInstance(SHA_256);
			byte[] secretKeyByteList = sha256.digest(passwordWithSecretKeySalt.getBytes(StandardCharsets.UTF_8));
			return IntStream.range(0, secretKeyByteList.length)
				.mapToObj(i -> String.format("%02x", 0xff & secretKeyByteList[i]))
				.collect(Collectors.joining());
		}
		catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}
	}

	public String getEncryptedData(String iv, String secretKey, String configData) {
		return "";
	}

	public String getMacBytes(String secretKey, String encryptedData) {
		return "";
	}

	public String getRandomIv() {
		return "";
	}

}
