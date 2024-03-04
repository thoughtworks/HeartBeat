package heartbeat.controller.source.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import static heartbeat.controller.source.SourceController.TOKEN_PATTER;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SourceControlDTO {

	@NotNull(message = "Token cannot be empty.")
	@Pattern(regexp = TOKEN_PATTER, message = "token's pattern is incorrect")
	private String token;

}
