package heartbeat.service.generateReporter;

import heartbeat.controller.report.vo.request.GenerateReportRequest;
import heartbeat.controller.report.vo.request.JiraBoardSetting;
import heartbeat.controller.report.vo.response.GenerateReportResponse;
import heartbeat.service.board.jira.JiraService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.lang.reflect.Field;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GenerateReporterServiceTest {

	@InjectMocks
	private GenerateReporterService generateReporterService;

	@Mock
	private JiraService jiraService;

	@Test
	void shouldReturnGenerateReportResponseWhenCallGenerateReporter() {
		GenerateReportRequest request = GenerateReportRequest.builder()
			.metrics(List.of("velocity"))
			.jiraBoardSetting(JiraBoardSetting.builder().treatFlagCardAsBlock(true).build())
			.build();
		GenerateReportResponse result = generateReporterService.generateReporter(request);
		assertThat(result).isEqualTo(GenerateReportResponse.builder().build());
	}

	@Test
	public void testCardsFieldUpdate() throws NoSuchFieldException, IllegalAccessException {
		GenerateReportRequest request = GenerateReportRequest.builder()
			.metrics(List.of("velocity"))
			.jiraBoardSetting(JiraBoardSetting.builder().treatFlagCardAsBlock(true).build())
			.build();

		Field cards = generateReporterService.getClass().getDeclaredField("cards");
		cards.setAccessible(true);

		Assertions.assertNull(cards.get(generateReporterService));

		generateReporterService.fetchOriginalData(request);

		Assertions.assertNull(cards.get(generateReporterService));

	}

}
