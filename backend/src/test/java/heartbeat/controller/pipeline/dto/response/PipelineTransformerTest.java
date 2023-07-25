package heartbeat.controller.pipeline.dto.response;

import heartbeat.client.dto.pipeline.buildkite.BuildKitePipelineDTO;
import heartbeat.client.dto.pipeline.buildkite.StepsDTO;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PipelineTransformerTest {

	@Test
	void shouldTransformToPipeline() {
		String orgId = "ORG_ID";
		String orgName = "ORG_NAME";
		List<StepsDTO> steps = List.of(StepsDTO.builder().name("Name1").build(), StepsDTO.builder().name("").build(),
				StepsDTO.builder().build());
		BuildKitePipelineDTO dto = BuildKitePipelineDTO.builder()
			.slug("SLUG")
			.name("Name")
			.repository("repository")
			.steps(steps)
			.build();

		Pipeline pipeline = PipelineTransformer.fromBuildKitePipelineDto(dto, orgId, orgName);

		assertEquals(pipeline.id, "SLUG");
		assertEquals(pipeline.name, "Name");
		assertEquals(pipeline.repository, "repository");
		assertEquals(pipeline.orgId, orgId);
		assertEquals(pipeline.orgName, orgName);
		assertEquals(pipeline.steps.size(), 1);
		assertEquals(pipeline.steps.get(0), "Name1");

	}

}
