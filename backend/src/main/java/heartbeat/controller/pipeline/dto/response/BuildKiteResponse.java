package heartbeat.controller.pipeline.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BuildKiteResponse {

	private List<Pipeline> pipelineList;

}
