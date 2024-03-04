package heartbeat.client.dto.pipeline.buildkite;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProviderDTO implements Serializable {

	private String id;

	private ProviderSettingsDTO settings;

	@JsonProperty("webhook_url")
	private String webhookUrl;

}
