package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.bind.DefaultValue;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class AvgLeadTimeForChanges {

	private String name = "Average";

	private Double mergeDelayTime;

	private Double pipelineDelayTime;

	private Double totalDelayTime;

}
