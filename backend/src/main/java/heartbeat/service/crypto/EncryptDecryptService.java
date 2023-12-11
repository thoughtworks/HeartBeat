package heartbeat.service.crypto;

import heartbeat.exception.DecryptDataOrPasswordWrongException;
import heartbeat.util.EncryptDecryptUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EncryptDecryptService {

	private final EncryptDecryptUtil encryptDecryptUtil;

	public String encryptConfigData(String configData, String password) {
		String iv = encryptDecryptUtil.getRandomIv();
		String secretKey = encryptDecryptUtil.getSecretKey(password);
		String encryptedConfigData = encryptDecryptUtil.getEncryptedData(iv, secretKey, configData);
		String macBytes = encryptDecryptUtil.getMacBytes(secretKey, iv + encryptedConfigData);
		return iv + encryptedConfigData + macBytes;
	}

	public String decryptConfigData(String encryptedData, String password) {
		String iv;
		String encryptedConfigData;
		String macBytes;
		try {
			iv = encryptDecryptUtil.cutIvFromEncryptedData(encryptedData);
			encryptedConfigData = encryptDecryptUtil.cutDataFromEncryptedData(encryptedData);
			macBytes = encryptDecryptUtil.cutMacBytesFromEncryptedData(encryptedData);
		}
		catch (StringIndexOutOfBoundsException e) {
			throw new DecryptDataOrPasswordWrongException("Invalid file", HttpStatus.BAD_REQUEST.value());
		}
		String secretKey = encryptDecryptUtil.getSecretKey(password);
		if (!encryptDecryptUtil.verifyMacBytes(secretKey, iv + encryptedConfigData, macBytes)) {
			throw new DecryptDataOrPasswordWrongException("Invalid file", HttpStatus.BAD_REQUEST.value());
		}
		return encryptDecryptUtil.getDecryptedData(iv, secretKey, encryptedConfigData);
	}

}
