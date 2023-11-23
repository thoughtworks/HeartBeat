package heartbeat.util;

import org.springframework.stereotype.Component;

@Component
public class EncryptDecryptUtil {

	public String getSecretKey(String password) {
		return "";
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
