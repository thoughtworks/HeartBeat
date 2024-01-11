package heartbeat.controller.pipeline.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenParam {

	@Valid
	@NotBlank(message = "Token cannot be empty.")
	private String token;

}
