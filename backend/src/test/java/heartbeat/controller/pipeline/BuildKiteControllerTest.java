package heartbeat.controller.pipeline;

import heartbeat.client.dto.BuildKiteOrganizationsInfo;
import heartbeat.controller.pipeline.vo.BuildKiteResponse;
import heartbeat.service.pipeline.buildKite.BuildKiteService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BuildKiteController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
public class BuildKiteControllerTest {

	@MockBean
	private BuildKiteService buildKiteService;

	@Autowired
	private MockMvc mockMvc;

	@Test
	void shouldReturnOrganizationNameAndSlugWhenCallBuildKiteMockServerOrganizationsAPI() throws Exception {
		List<BuildKiteOrganizationsInfo> buildKiteOrganizationsInfoList = new ArrayList<BuildKiteOrganizationsInfo>() {
			{
				add(new BuildKiteOrganizationsInfo("XXXX", "XXXX"));
			}
		};
		BuildKiteResponse buildKiteResponse = BuildKiteResponse.builder()
			.buildKiteOrganizationsInfoList(buildKiteOrganizationsInfoList)
			.build();

		when(buildKiteService.fetchPipelineInfo()).thenReturn(buildKiteResponse);

		mockMvc.perform(get("/pipeline").contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.buildKiteOrganizationsInfoList[0].name").value("XXXX"))
			.andExpect(jsonPath("$.buildKiteOrganizationsInfoList[0].slug").value("XXXX"));
	}

}
