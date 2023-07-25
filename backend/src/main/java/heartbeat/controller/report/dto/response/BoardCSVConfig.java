package heartbeat.controller.report.dto.response;

import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardCSVConfig {

	private String label;

	private String value;

	@Nullable
	private String originKey;

}
