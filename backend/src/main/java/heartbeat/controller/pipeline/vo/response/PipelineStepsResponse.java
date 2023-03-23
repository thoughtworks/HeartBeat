package heartbeat.controller.pipeline.vo.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PipelineStepsResponse {

	private String id;

	private String name;

	private List<String> steps;

	private String repository;

	private String orgId;

	private String orgName;

}
