package heartbeat.controller.pipeline.vo.response;

import heartbeat.client.dto.PipelineDTO;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BuildKiteResponse {

	private List<Pipeline> pipelineList;

}
