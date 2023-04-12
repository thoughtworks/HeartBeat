package heartbeat.service.generateReporter;

import heartbeat.controller.board.vo.request.Cards;
import heartbeat.controller.board.vo.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.report.vo.request.GenerateReportRequest;
import heartbeat.controller.report.vo.request.JiraBoardSetting;
import heartbeat.controller.report.vo.request.RequireDataEnum;
import heartbeat.controller.report.vo.response.GenerateReportResponse;
import heartbeat.service.board.jira.JiraService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Log4j2

public class GenerateReporterService {

	private Cards cards;

	private final JiraService jiraService;

	private final List<String> KanbanMetrics = Stream
		.of(RequireDataEnum.VELOCITY, RequireDataEnum.CYCLE_TIME, RequireDataEnum.CLASSIFICATION)
		.map(RequireDataEnum::getValue)
		.toList();

	public GenerateReportResponse generateReporter(GenerateReportRequest request) {
		this.fetchOriginalData(request);
		return GenerateReportResponse.builder().build();
	}

	public void fetchOriginalData(GenerateReportRequest request) {
		List<String> lowMetrics = request.getMetrics().stream().map(String::toLowerCase).toList();

		if (lowMetrics.stream().anyMatch(this.KanbanMetrics::contains)) {
			fetchDataFromKanban(request);
		}
	}

	private void fetchDataFromKanban(GenerateReportRequest request) {
		JiraBoardSetting jiraBoardSetting = request.getJiraBoardSetting();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = StoryPointsAndCycleTimeRequest.builder()
			.token(jiraBoardSetting.getToken())
			.type(jiraBoardSetting.getType())
			.site(jiraBoardSetting.getSite())
			.project(jiraBoardSetting.getProjectKey())
			.boardId(jiraBoardSetting.getBoardId())
			.status(jiraBoardSetting.getDoneColumn())
			.startTime(request.getStartTime())
			.endTime(request.getEndTime())
			.targetFields(jiraBoardSetting.getTargetFields())
			.treatFlagCardAsBlock(jiraBoardSetting.getTreatFlagCardAsBlock())
			.build();
		this.cards = jiraService.getStoryPointsAndCycleTime(storyPointsAndCycleTimeRequest,
			jiraBoardSetting.getBoardColumns(), jiraBoardSetting.getUsers());

	}

}
