package heartbeat.controller.pipeline.vo.response;

import heartbeat.client.dto.BuildKiteOrganizationsInfo;
import heartbeat.client.dto.PipelineDTO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BuildKiteResponse {

	private List<PipelineDTO> pipelineList;

}
