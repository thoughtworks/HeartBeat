package heartbeat.service.pipeline.buildkite;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import heartbeat.client.BuildKiteFeignClient;
import heartbeat.client.dto.BuildKiteOrganizationsInfo;
import heartbeat.client.dto.PipelineDTO;
import heartbeat.controller.pipeline.vo.response.BuildKiteResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class BuildKiteServiceTest {

	@Mock
	BuildKiteFeignClient buildKiteFeignClient;

	@InjectMocks
	BuildKiteService buildKiteService;

	@Test
	void shouldReturnBuildKiteResponseWhenCallBuildKiteApi() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		List<PipelineDTO> pipelineDTOS = mapper.readValue(
				new File("src/test/java/heartbeat/controller/pipeline/pipelineInfoData.json"), new TypeReference<>() {
				});
		when(buildKiteFeignClient.getBuildKiteOrganizationsInfo())
			.thenReturn(List.of(BuildKiteOrganizationsInfo.builder().name("XXXX").slug("XXXX").build()));
		when(buildKiteFeignClient.getPipelineInfo("XXXX", "1", "100")).thenReturn(pipelineDTOS);

		BuildKiteResponse buildKiteResponse = buildKiteService.fetchPipelineInfo();

		assertThat(buildKiteResponse.getPipelineList().size()).isEqualTo(1);
		List<PipelineDTO> pipelineList = buildKiteResponse.getPipelineList();
		assertThat(pipelineList.get(0).getId()).isEqualTo("0186104b-aa31-458c-a58c-63266806f2fe");

	}

}
