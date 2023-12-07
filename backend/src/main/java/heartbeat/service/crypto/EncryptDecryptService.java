package heartbeat.service.crypto;

import heartbeat.exception.DecryptDataOrPasswordException;
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
		String encryptedData = encryptDecryptUtil.getEncryptedData(iv, secretKey, configData);
		String macBytes = encryptDecryptUtil.getMacBytes(secretKey, encryptedData);
		return iv + encryptedData + macBytes;
	}

	public String decryptConfigData(String encryptedData, String password) {
		String iv;
		String data;
		String macBytes;
		try {
			iv = encryptDecryptUtil.cutIvFromEncryptedData(encryptedData);
			data = encryptDecryptUtil.cutDataFromEncryptedData(encryptedData);
			macBytes = encryptDecryptUtil.cutMacBytesFromEncryptedData(encryptedData);
		}
		catch (StringIndexOutOfBoundsException e) {
			throw new DecryptDataOrPasswordException("Invalid file", HttpStatus.BAD_REQUEST.value());
		}
		String secretKey = encryptDecryptUtil.getSecretKey(password);
		if (!encryptDecryptUtil.verifyMacBytes(secretKey, data, macBytes)) {
			throw new DecryptDataOrPasswordException("Invalid file", HttpStatus.BAD_REQUEST.value());
		}
		return encryptDecryptUtil.getDecryptedData(iv, secretKey, data);
	}

}
