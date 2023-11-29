package heartbeat.controller.report;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import heartbeat.controller.report.dto.request.ExportCSVRequest;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.exception.GenerateReportException;
import heartbeat.service.report.GenerateReporterService;
import heartbeat.controller.report.dto.response.AvgDeploymentFrequency;
import heartbeat.controller.report.dto.response.DeploymentFrequency;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.controller.report.dto.response.Velocity;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.io.ByteArrayInputStream;
import java.io.File;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
	void shouldReturnAcceptedStatusAndCallbackUrlAndInterval() throws Exception {
		ReportResponse expectedResponse = ReportResponse.builder()
			.velocity(Velocity.builder().velocityForSP(10).build())
			.deploymentFrequency(DeploymentFrequency.builder()
				.avgDeploymentFrequency(new AvgDeploymentFrequency("Average", 0.10F))
				.build())
			.build();

		ObjectMapper mapper = new ObjectMapper();
		GenerateReportRequest request = mapper
			.readValue(new File("src/test/java/heartbeat/controller/report/request.json"), GenerateReportRequest.class);
		String currentTimeStamp = "1685010080107";
		request.setCsvTimeStamp(currentTimeStamp);

		when(generateReporterService.generateReporter(request)).thenReturn(expectedResponse);

		MockHttpServletResponse response = mockMvc
			.perform(post("/reports").contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(request)))
			.andExpect(status().isAccepted())
			.andReturn()
			.getResponse();

		final var callbackUrl = JsonPath.parse(response.getContentAsString()).read("$.callbackUrl").toString();
		final var interval = JsonPath.parse(response.getContentAsString()).read("$.interval").toString();
		assertEquals("/reports/" + currentTimeStamp, callbackUrl);
		assertEquals("5", interval);
	}

	@Test
	void shouldReturnCreatedStatusWhenCheckGenerateReportIsTrue() throws Exception {
		// given
		String reportId = Long.toString(System.currentTimeMillis());
		// when
		when(generateReporterService.checkGenerateReportIsDone(Long.parseLong(reportId))).thenReturn(true);
		when(generateReporterService.parseReportJson(reportId))
			.thenReturn(ReportResponse.builder().exportValidityTime(180000L).build());
		// then
		MockHttpServletResponse response = mockMvc
			.perform(get("/reports/{reportId}", reportId).contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isCreated())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var exportValidityTime = JsonPath.parse(content).read("$.exportValidityTime");

		assertEquals(180000, exportValidityTime);

	}

	@Test
	void shouldReturnNoContentStatusWhenCheckGenerateReportIsFalse() throws Exception {
		// given
		String reportId = Long.toString(System.currentTimeMillis());
		// when
		when(generateReporterService.checkGenerateReportIsDone(Long.parseLong(reportId))).thenReturn(false);
		// then
		mockMvc.perform(get("/reports/{reportId}", reportId).contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isNoContent())
			.andReturn()
			.getResponse();
	}

	@Test
	void shouldReturnInternalServerErrorStatusWhenCheckGenerateReportThrowException() throws Exception {
		// given
		String reportId = Long.toString(System.currentTimeMillis());
		// when
		when(generateReporterService.checkGenerateReportIsDone(Long.parseLong(reportId)))
			.thenThrow(new GenerateReportException("Report time expires"));
		// then
		var response = mockMvc.perform(get("/reports/{reportId}", reportId).contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isInternalServerError())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var errorMessage = JsonPath.parse(content).read("$.message").toString();
		final var hintInfo = JsonPath.parse(content).read("$.hintInfo").toString();

		assertEquals("Report time expires", errorMessage);
		assertEquals("Generate report failed", hintInfo);

	}

	@Test
	void shouldReturnWhenExportCsv() throws Exception {
		String dataType = "pipeline";
		String csvTimeStamp = "1685010080107";
		String expectedResponse = "csv data";

		when(generateReporterService
			.fetchCSVData(ExportCSVRequest.builder().dataType(dataType).csvTimeStamp(csvTimeStamp).build()))
			.thenReturn(new InputStreamResource(new ByteArrayInputStream(expectedResponse.getBytes())));

		MockHttpServletResponse response = mockMvc
			.perform(get("/reports/{dataType}/{csvTimeStamp}", dataType, csvTimeStamp))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse();

		assertThat(response.getContentAsString()).isEqualTo(expectedResponse);

	}

}
