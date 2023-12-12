package heartbeat.service.crypto;

import heartbeat.exception.DecryptDataOrPasswordWrongException;
import heartbeat.util.EncryptDecryptUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@Log4j2
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
			log.error("Failed to get iv encryptedConfigData macBytes, because of encryptedData length is incorrect");
			throw new DecryptDataOrPasswordWrongException("Invalid file", HttpStatus.BAD_REQUEST.value());
		}
		String secretKey = encryptDecryptUtil.getSecretKey(password);
		if (!encryptDecryptUtil.verifyMacBytes(secretKey, iv + encryptedConfigData, macBytes)) {
			log.error("Failed to verify mac bytes, because of the file may be changed");
			throw new DecryptDataOrPasswordWrongException("Invalid file", HttpStatus.BAD_REQUEST.value());
		}
		return encryptDecryptUtil.getDecryptedData(iv, secretKey, encryptedConfigData);
	}

}
