package heartbeat.controller.crypto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
public class DecryptRequest {

	@NotBlank(message = "EncryptedData cannot be blank.")
	private String encryptedData;

	@NotNull(message = "Password cannot be null.")
	@Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,50}$",
			message = "Password length can only be within 6-50 characters and contain letters and numbers.")
	private String password;

}
