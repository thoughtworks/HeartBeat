package heartbeat.controller.pipeline.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PipelineStepsDTO {

	private String pipelineId;

	private String name;

	private List<String> steps;

	private String repository;

	private String orgId;

	private String orgName;

	private List<String> branches;

	private List<String> pipelineCrews;

}
