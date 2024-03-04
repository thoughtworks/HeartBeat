package heartbeat.controller.version;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Version")
@RequestMapping("/version")
@Validated
@Log4j2
public class VersionController {

	@Value("${heartbeat.version}")
	private String version;

	@GetMapping()
	public ResponseEntity<Map<String, String>> getVersion() {
		Map<String, String> response = new HashMap<>();
		response.put("version", version);
		return ResponseEntity.ok(response);
	}

}
