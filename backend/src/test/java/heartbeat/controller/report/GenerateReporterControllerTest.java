package heartbeat.controller.report;

import com.jayway.jsonpath.JsonPath;
import heartbeat.controller.report.vo.response.GenerateReportResponse;
import heartbeat.controller.report.vo.response.Velocity;
import heartbeat.service.report.GenerateReporterService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GenerateReportController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
class GenerateReporterControllerTest {

	@MockBean
	private GenerateReporterService generateReporterService;

	@Autowired
	private MockMvc mockMvc;

	@Test
	void shouldReturnOkStatusAndCorrectResponseWithRepos() throws Exception {
		GenerateReportResponse expectedResponse = GenerateReportResponse.builder()
			.velocity(Velocity.builder().velocityForSP("10").build())
			.build();

		when(generateReporterService.generateReporter(any())).thenReturn(expectedResponse);

		MockHttpServletResponse response = mockMvc.perform(get("/report"))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse();
		final var resultVelocity = JsonPath.parse(response.getContentAsString())
			.read("$.velocity.velocityForSP")
			.toString();
		assertThat(resultVelocity).contains("10");
	}

}
