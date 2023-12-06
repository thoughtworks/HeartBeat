package heartbeat.controller.crypto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EncryptRequest {

	@NotBlank(message = "ConfigData must not be blank")
	private String configData;

	@NotBlank(message = "Password must not be blank")
	@Size(max = 50, message = "Password is longer than 50")
	private String password;

}
