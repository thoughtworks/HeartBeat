package heartbeat.service.report;

import heartbeat.controller.board.vo.request.Cards;
import heartbeat.controller.report.vo.request.GenerateReportRequest;
import heartbeat.controller.report.vo.request.JiraBoardSetting;
import heartbeat.controller.report.vo.response.GenerateReportResponse;
import heartbeat.controller.report.vo.response.Velocity;
import heartbeat.service.board.jira.JiraService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GenerateReporterServiceTest {

	@InjectMocks
	GenerateReporterService generateReporterService;

	@Mock
	JiraService jiraService;

	@Test
	void shouldReturnGenerateReportResponseWhenCallGenerateReporter() {
		JiraBoardSetting jiraBoardSetting = JiraBoardSetting.builder()
			.boardId("")
			.boardColumns(List.of())
			.token("testToken")
			.site("site")
			.doneColumn(List.of())
			.treatFlagCardAsBlock(true)
			.type("jira")
			.projectKey("PLL")
			.teamId("HB")
			.teamName("HB")
			.build();
		GenerateReportRequest request = GenerateReportRequest.builder()
			.metrics(List.of("velocity"))
			.jiraBoardSetting(jiraBoardSetting)
			.startTime("123")
			.endTime("123")
			.jiraBoardSetting(JiraBoardSetting.builder().treatFlagCardAsBlock(true).build())
			.build();

		when(jiraService.getStoryPointsAndCycleTime(any(), any(), any()))
			.thenReturn(Cards.builder().storyPointSum(0).cardsNumber(0).build());

		GenerateReportResponse result = generateReporterService.generateReporter(request);
		Velocity velocity = Velocity.builder().velocityForSP("0").velocityForCards("0").build();

		assertThat(result).isEqualTo(GenerateReportResponse.builder().velocity(velocity).build());
	}

}
