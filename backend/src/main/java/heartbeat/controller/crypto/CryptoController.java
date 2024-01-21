package heartbeat.controller.crypto;

import heartbeat.controller.crypto.request.DecryptRequest;
import heartbeat.controller.crypto.request.EncryptRequest;
import heartbeat.controller.crypto.response.DecryptResponse;
import heartbeat.controller.crypto.response.EncryptResponse;
import heartbeat.service.crypto.EncryptDecryptService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@Tag(name = "Crypto")
@RequiredArgsConstructor
public class CryptoController {

	private final EncryptDecryptService encryptDecryptService;

	@PostMapping("/encrypt")
	public EncryptResponse encrypt(@RequestBody @Validated EncryptRequest request) {
		Long timeStamp = System.currentTimeMillis();
		log.info("Start to get encrypt data at time stamp: {}", timeStamp);
		String encryptedData = encryptDecryptService.encryptConfigData(request.getConfigData(), request.getPassword());
		log.info("Successfully get encrypt data start from time stamp: {}", timeStamp);
		return EncryptResponse.builder().encryptedData(encryptedData).build();
	}

	@PostMapping("/decrypt")
	public DecryptResponse decrypt(@RequestBody @Validated DecryptRequest request) {
		long timeStamp = System.currentTimeMillis();
		log.info("Start to get decrypt data at time stamp: {}", timeStamp);
		String configData = encryptDecryptService.decryptConfigData(request.getEncryptedData(), request.getPassword());
		log.info("Successfully get decrypt data start from time stamp: {}", timeStamp);
		return DecryptResponse.builder().configData(configData).build();
	}

}
