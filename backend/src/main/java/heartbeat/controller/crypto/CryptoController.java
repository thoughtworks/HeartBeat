package heartbeat.controller.crypto;

import heartbeat.controller.crypto.request.EncryptRequest;
import heartbeat.controller.crypto.response.EncryptResponse;
import heartbeat.service.crypto.EncryptDecryptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequiredArgsConstructor
public class CryptoController {

	private final EncryptDecryptService encryptDecryptService;

	@PostMapping("/encrypt")
	public EncryptResponse encrypt(@RequestBody @Validated EncryptRequest request) {
		String encryptedData = encryptDecryptService.encryptConfigData(request.getConfigData(), request.getPassword());
		return EncryptResponse.builder().encryptedData(encryptedData).build();
	}

}
