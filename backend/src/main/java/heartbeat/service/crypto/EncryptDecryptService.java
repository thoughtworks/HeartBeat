package heartbeat.service.crypto;

import heartbeat.exception.DecryptProcessException;
import heartbeat.util.EncryptDecryptUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EncryptDecryptService {

	private final EncryptDecryptUtil encryptDecryptUtil;

	public String encryptConfigData(String configData, String password) {
		String iv = encryptDecryptUtil.getRandomIv();
		String secretKey = encryptDecryptUtil.getSecretKey(password);
		String encryptedData = encryptDecryptUtil.getEncryptedData(iv, secretKey, configData);
		String macBytes = encryptDecryptUtil.getMacBytes(secretKey, encryptedData);
		return iv + encryptedData + macBytes;
	}

	public String decryptConfigData(String encryptedData, String password) {
		String iv = encryptedData.substring(0, 32);
		String data = encryptedData.substring(32, encryptedData.length() - 44);
		String macBytes = encryptedData.substring(encryptedData.length() - 44);
		String secretKey = encryptDecryptUtil.getSecretKey(password);
		if (!encryptDecryptUtil.verifyMacBytes(secretKey, data, macBytes)) {
			throw new DecryptProcessException("", 400);
		}
		return encryptDecryptUtil.getDecryptedData(iv, secretKey, data);
	}

}
