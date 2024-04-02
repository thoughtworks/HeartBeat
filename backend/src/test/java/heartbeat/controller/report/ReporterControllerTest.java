package heartbeat.controller.report;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.ReportType;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.GenerateReportException;
import heartbeat.service.report.GenerateReporterService;
import heartbeat.service.report.ReportService;
import heartbeat.tools.TimeUtils;
import lombok.extern.log4j.Log4j2;
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

import static heartbeat.service.report.scheduler.DeleteExpireCSVScheduler.EXPORT_CSV_VALIDITY_TIME;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReportController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
@Log4j2
class ReporterControllerTest {

	private static final String REQUEST_FILE_PATH = "src/test/java/heartbeat/controller/report/request.json";

	@MockBean
	private GenerateReporterService generateReporterService;

	@MockBean
	private ReportService reporterService;

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper mapper = new ObjectMapper();

	@Test
	void shouldGetSuccessDataGivenReportId() throws Exception {
		String reportId = Long.toString(System.currentTimeMillis());
		ReportResponse MockReportResponse = ReportResponse.builder()
			.boardMetricsCompleted(true)
			.allMetricsCompleted(true)
			.build();

		when(generateReporterService.getComposedReportResponse(reportId)).thenReturn(MockReportResponse);

		String reportResponseString = mockMvc
			.perform(get("/reports/{reportId}", reportId).contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.allMetricsCompleted").value(true))
			.andReturn()
			.getResponse()
			.getContentAsString();
		ReportResponse response = mapper.readValue(reportResponseString, new TypeReference<>() {
		});
		verify(generateReporterService).getComposedReportResponse(any());
		assertEquals(true, response.getBoardMetricsCompleted());
		assertEquals(true, response.getAllMetricsCompleted());
	}

	@Test
	void shouldReturn500StatusWhenRequestGenerateReportGivenReportTimeIsExpired() throws Exception {
		String reportId = Long.toString(System.currentTimeMillis() - EXPORT_CSV_VALIDITY_TIME - 200L);
		doThrow(new GenerateReportException("Failed to get report due to report time expires"))
			.when(generateReporterService)
			.getComposedReportResponse(any());

		mockMvc.perform(get("/reports/{reportId}", reportId).contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isInternalServerError())
			.andExpect(jsonPath("$.message").value("Failed to get report due to report time expires"))
			.andReturn()
			.getResponse();
		verify(generateReporterService).getComposedReportResponse(any());
	}

	@Test
	void shouldReturnWhenExportCsv() throws Exception {
		long csvTimeStamp = TimeUtils.mockTimeStamp(2023, 5, 25, 18, 21, 20);
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
	void shouldReturnCallBackUrlWithAcceptedStatusAndInvokeWhenGenerateReportByType() throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		GenerateReportRequest request = mapper.readValue(new File(REQUEST_FILE_PATH), GenerateReportRequest.class);

		String currentTimeStamp = "1685010080107";
		request.setCsvTimeStamp(currentTimeStamp);

		doAnswer(invocation -> null).when(reporterService).generateReport(request);

		mockMvc
			.perform(post("/reports").contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(request)))
			.andExpect(status().isAccepted())
			.andExpect(jsonPath("$.callbackUrl").value("/reports/" + currentTimeStamp))
			.andExpect(jsonPath("$.interval").value("10"))
			.andReturn()
			.getResponse();

		verify(reporterService, times(1)).generateReport(request);
	}

}
