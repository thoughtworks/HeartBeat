package heartbeat.controller.crypto;

import heartbeat.controller.crypto.request.EncryptRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@Validated
@RestController
@RequiredArgsConstructor
public class CryptoController {
	@PostMapping("/encrypt")
	public String encrypt(@RequestBody EncryptRequest request) {
		return "";
	}
}
