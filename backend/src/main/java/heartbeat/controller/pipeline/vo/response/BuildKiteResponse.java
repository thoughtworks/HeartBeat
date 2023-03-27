package heartbeat.controller.pipeline.vo.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BuildKiteResponse {

	private List<Pipeline> pipelineList;

}
