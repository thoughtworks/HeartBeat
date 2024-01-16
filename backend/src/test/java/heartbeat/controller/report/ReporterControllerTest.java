package heartbeat.controller.report;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.ReportType;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.GenerateReportException;
import heartbeat.handler.AsyncExceptionHandler;
import heartbeat.service.report.GenerateReporterService;
import heartbeat.service.report.ReportService;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReportController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
class ReporterControllerTest {

	private static final String REQUEST_FILE_PATH = "src/test/java/heartbeat/controller/report/request.json";

	private static final String RESPONSE_FILE_PATH = "src/test/java/heartbeat/controller/report/reportResponse.json";

	@MockBean
	private GenerateReporterService generateReporterService;

	@MockBean
	private ReportService reporterService;

	@MockBean
	private AsyncExceptionHandler asyncExceptionHandler;

	@Autowired
	private MockMvc mockMvc;

	@Test
	void shouldReturnCreatedStatusWhenCheckGenerateReportIsTrue() throws Exception {
		String reportId = Long.toString(System.currentTimeMillis());
		ObjectMapper mapper = new ObjectMapper();
		ReportResponse expectedReportResponse = mapper.readValue(new File(RESPONSE_FILE_PATH), ReportResponse.class);

		when(generateReporterService.checkGenerateReportIsDone(reportId)).thenReturn(true);
		when(generateReporterService.getComposedReportResponse(reportId, true)).thenReturn(expectedReportResponse);

		MockHttpServletResponse response = mockMvc
			.perform(get("/reports/{reportId}", reportId).contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isCreated())
			.andReturn()
			.getResponse();
		final var content = response.getContentAsString();
		ReportResponse actualReportResponse = mapper.readValue(content, ReportResponse.class);

		assertEquals(expectedReportResponse, actualReportResponse);
	}

	@Test
	void shouldReturnOkStatusWhenCheckGenerateReportIsFalse() throws Exception {
		String reportId = Long.toString(System.currentTimeMillis());
		ReportResponse reportResponse = ReportResponse.builder()
			.boardMetricsCompleted(false)
			.allMetricsCompleted(false)
			.build();

		when(generateReporterService.checkGenerateReportIsDone(reportId)).thenReturn(false);
		when(generateReporterService.getComposedReportResponse(reportId, false)).thenReturn(reportResponse);

		MockHttpServletResponse response = mockMvc
			.perform(get("/reports/{reportId}", reportId).contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse();
		final var content = response.getContentAsString();
		final var isAllMetricsReady = JsonPath.parse(content).read("$.allMetricsCompleted");

		assertEquals(false, isAllMetricsReady);
	}

	@Test
	void shouldReturnInternalServerErrorStatusWhenCheckGenerateReportThrowException() throws Exception {
		String reportId = Long.toString(System.currentTimeMillis());

		when(generateReporterService.checkGenerateReportIsDone(reportId))
			.thenThrow(new GenerateReportException("Report time expires"));

		var response = mockMvc.perform(get("/reports/{reportId}", reportId).contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isInternalServerError())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var errorMessage = JsonPath.parse(content).read("$.message").toString();
		final var hintInfo = JsonPath.parse(content).read("$.hintInfo").toString();

		assertEquals("Report time expires", errorMessage);
		assertEquals("Failed to generate report", hintInfo);
	}

	@Test
	void shouldReturnWhenExportCsv() throws Exception {
		Long csvTimeStamp = 1685010080107L;
		String expectedResponse = "csv data";

		when(reporterService.exportCsv(ReportType.PIPELINE, csvTimeStamp))
			.thenReturn(new InputStreamResource(new ByteArrayInputStream(expectedResponse.getBytes())));

		MockHttpServletResponse response = mockMvc
			.perform(get("/reports/{reportType}/{csvTimeStamp}", ReportType.PIPELINE.getValue(), csvTimeStamp))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse();

		assertThat(response.getContentAsString()).isEqualTo(expectedResponse);

	}

	@Test
	void shouldReturnCallBackUrlWithAcceptedStatusAndInvokeGenerateDoraReportWhenReportTypeIsDora() throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		GenerateReportRequest request = mapper.readValue(new File(REQUEST_FILE_PATH), GenerateReportRequest.class);
		String currentTimeStamp = "1685010080107";
		request.setCsvTimeStamp(currentTimeStamp);

		MockHttpServletResponse response = mockMvc
			.perform(post("/reports/dora").contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(request)))
			.andExpect(status().isAccepted())
			.andReturn()
			.getResponse();

		Thread.sleep(2000);
		verify(generateReporterService, times(1)).generateDoraReport(request);
		verify(generateReporterService, times(0)).generateBoardReport(request);

		final var callbackUrl = JsonPath.parse(response.getContentAsString()).read("$.callbackUrl").toString();
		final var interval = JsonPath.parse(response.getContentAsString()).read("$.interval").toString();
		assertEquals("/reports/" + currentTimeStamp, callbackUrl);
		assertEquals("10", interval);
	}

	@Test
	void shouldReturnCallBackUrlWithAcceptedStatusAndInvokeGenerateBoardReportWhenReportTypeIsBoard() throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		GenerateReportRequest request = mapper.readValue(new File(REQUEST_FILE_PATH), GenerateReportRequest.class);
		String currentTimeStamp = "1685010080107";
		request.setCsvTimeStamp(currentTimeStamp);

		MockHttpServletResponse response = mockMvc
			.perform(post("/reports/board").contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(request)))
			.andExpect(status().isAccepted())
			.andReturn()
			.getResponse();

		Thread.sleep(2000);
		verify(generateReporterService, times(0)).generateDoraReport(request);
		verify(generateReporterService, times(1)).generateBoardReport(request);

		final var callbackUrl = JsonPath.parse(response.getContentAsString()).read("$.callbackUrl").toString();
		final var interval = JsonPath.parse(response.getContentAsString()).read("$.interval").toString();
		assertEquals("/reports/" + currentTimeStamp, callbackUrl);
		assertEquals("10", interval);
	}

}
