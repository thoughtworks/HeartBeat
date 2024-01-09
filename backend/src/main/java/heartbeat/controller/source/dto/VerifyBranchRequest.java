package heartbeat.controller.source.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VerifyBranchRequest {

	@NotNull(message = "Token cannot be empty.")
	@Pattern(regexp = "^(ghp|gho|ghu|ghs|ghr)_([a-zA-Z0-9]{36})$", message = "token's pattern is incorrect")
	private String token;

	@NotBlank(message = "Repository is required.")
	private String repository;

}
