package heartbeat.service.report;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import heartbeat.client.component.JiraUriGenerator;
import heartbeat.client.dto.board.jira.JiraBoardConfigDTO;
import heartbeat.client.dto.board.jira.JiraCardField;
import heartbeat.client.dto.board.jira.Status;
import heartbeat.client.dto.codebase.github.CommitInfo;
import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteJob;
import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.board.dto.request.BoardRequestParam;
import heartbeat.controller.board.dto.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.CycleTimeInfo;
import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.board.dto.response.JiraColumnDTO;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.pipeline.dto.request.DeploymentEnvironment;
import heartbeat.controller.report.dto.request.CodebaseSetting;
import heartbeat.controller.report.dto.request.ExportCSVRequest;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.controller.report.dto.response.BoardCSVConfig;
import heartbeat.controller.report.dto.response.BoardCSVConfigEnum;
import heartbeat.controller.report.dto.response.ErrorInfo;
import heartbeat.controller.report.dto.response.LeadTimeInfo;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.controller.report.dto.response.PipelineCSVInfo;
import heartbeat.controller.report.dto.response.ReportError;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.BadRequestException;
import heartbeat.exception.BaseException;
import heartbeat.exception.GenerateReportException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.RequestFailedException;
import heartbeat.exception.ServiceUnavailableException;
import heartbeat.handler.AsyncExceptionHandler;
import heartbeat.handler.AsyncReportRequestHandler;
import heartbeat.service.board.jira.JiraColumnResult;
import heartbeat.service.board.jira.JiraService;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import heartbeat.service.report.calculator.ChangeFailureRateCalculator;
import heartbeat.service.report.calculator.ClassificationCalculator;
import heartbeat.service.report.calculator.CycleTimeCalculator;
import heartbeat.service.report.calculator.DeploymentFrequencyCalculator;
import heartbeat.service.report.calculator.MeanToRecoveryCalculator;
import heartbeat.service.report.calculator.VelocityCalculator;
import heartbeat.service.report.calculator.model.FetchedData;
import heartbeat.service.report.calculator.model.FetchedData.BuildKiteData;
import heartbeat.service.report.calculator.model.FetchedData.CardCollectionInfo;
import heartbeat.service.source.github.GitHubService;
import heartbeat.util.DecimalUtil;
import heartbeat.util.GithubUtil;

import java.io.File;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;

import heartbeat.util.IdUtil;
import heartbeat.util.MetricsUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.val;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import static heartbeat.service.report.scheduler.DeleteExpireCSVScheduler.EXPORT_CSV_VALIDITY_TIME;

@Service
@RequiredArgsConstructor
@Log4j2
public class GenerateReporterService {

	private static final String[] FIELD_NAMES = { "assignee", "summary", "status", "issuetype", "reporter",
			"timetracking", "statusCategoryChangeData", "storyPoints", "fixVersions", "project", "parent", "priority",
			"labels" };

	private static final List<String> REQUIRED_STATES = List.of("passed", "failed");

	private final JiraService jiraService;

	private final WorkDay workDay;

	private final ClassificationCalculator classificationCalculator;

	private final GitHubService gitHubService;

	private final BuildKiteService buildKiteService;

	private final DeploymentFrequencyCalculator deploymentFrequency;

	private final ChangeFailureRateCalculator changeFailureRate;

	private final MeanToRecoveryCalculator meanToRecoveryCalculator;

	private final CycleTimeCalculator cycleTimeCalculator;

	private final VelocityCalculator velocityCalculator;

	private final CSVFileGenerator csvFileGenerator;

	private final LeadTimeForChangesCalculator leadTimeForChangesCalculator;

	private final JiraUriGenerator urlGenerator;

	private final AsyncReportRequestHandler asyncReportRequestHandler;

	private final AsyncExceptionHandler asyncExceptionHandler;

	private static StoryPointsAndCycleTimeRequest buildStoryPointsAndCycleTimeRequest(JiraBoardSetting jiraBoardSetting,
			String startTime, String endTime) {
		return StoryPointsAndCycleTimeRequest.builder()
			.token(jiraBoardSetting.getToken())
			.type(jiraBoardSetting.getType())
			.site(jiraBoardSetting.getSite())
			.project(jiraBoardSetting.getProjectKey())
			.boardId(jiraBoardSetting.getBoardId())
			.status(jiraBoardSetting.getDoneColumn())
			.startTime(startTime)
			.endTime(endTime)
			.targetFields(jiraBoardSetting.getTargetFields())
			.treatFlagCardAsBlock(jiraBoardSetting.getTreatFlagCardAsBlock())
			.build();
	}

	private Map<String, String> getRepoMap(List<DeploymentEnvironment> deploymentEnvironments) {
		Map<String, String> repoMap = new HashMap<>();
		for (DeploymentEnvironment currentValue : deploymentEnvironments) {
			repoMap.put(currentValue.getId(), currentValue.getRepository());
		}
		return repoMap;
	}

	private List<BoardCSVConfig> getFixedBoardFields() {
		List<BoardCSVConfig> fields = new ArrayList<>();
		for (BoardCSVConfigEnum field : BoardCSVConfigEnum.values()) {
			fields.add(BoardCSVConfig.builder().label(field.getLabel()).value(field.getValue()).build());
		}
		return fields;
	}

	private String getFieldDisplayValue(Object object) {
		Gson gson = new Gson();
		String result = "";
		if (object == null || object instanceof JsonNull || object instanceof Double || object instanceof String
				|| object instanceof JsonPrimitive) {
			return result;
		}

		Object tempObject = object;

		if (tempObject instanceof List<?> list && !list.isEmpty()) {
			tempObject = list.get(0);
			result = "[0]";
		}
		else if (tempObject instanceof JsonArray jsonArray && !jsonArray.isEmpty()) {
			tempObject = jsonArray.get(0);
			result = "[0]";
		}
		else {
			return result;
		}

		JsonObject jsonObject = gson.toJsonTree(tempObject).getAsJsonObject();
		if (jsonObject.has("name")) {
			result += ".name";
		}
		else if (jsonObject.has("displayName")) {
			result += ".displayName";
		}
		else if (jsonObject.has("value")) {
			result += ".value";
		}
		else if (jsonObject.has("key")) {
			result += ".key";
		}

		return result;
	}

	public void generateBoardReport(GenerateReportRequest request) {
		initializeMetricsDataCompletedInHandler(request.getCsvTimeStamp(), request.getMetrics());
		String boardReportId = IdUtil.getBoardReportId(request.getCsvTimeStamp());
		removePreviousAsyncException(boardReportId);
		log.info(
				"Start to generate board report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _boardReportId: {}",
				request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(), request.getEndTime(),
				boardReportId);
		try {
			saveReporterInHandler(generateReporter(request), boardReportId);
			updateMetricsDataCompletedInHandler(request.getCsvTimeStamp(), request.getMetrics());
			log.info(
					"Successfully generate board report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _boardReportId: {}",
					request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(), request.getEndTime(),
					boardReportId);
		}
		catch (BaseException e) {
			handleException(request, boardReportId, e);
		}
	}

	private void handleException(GenerateReportRequest request, String reportId, BaseException e) {
		asyncExceptionHandler.put(reportId, e);
		if (e.getStatus() == 401 || e.getStatus() == 403 || e.getStatus() == 404)
			updateMetricsDataCompletedInHandler(request.getCsvTimeStamp(), request.getMetrics());
	}

	public void generateDoraReport(GenerateReportRequest request) {
		MetricsDataCompleted metricsDataStatus = getMetricsStatus(request.getMetrics(), Boolean.TRUE);
		initializeMetricsDataCompletedInHandler(request.getCsvTimeStamp(), request.getMetrics());
		removePreviousAsyncException(IdUtil.getPipelineReportId(request.getCsvTimeStamp()));
		removePreviousAsyncException(IdUtil.getSourceControlReportId(request.getCsvTimeStamp()));
		if (Objects.nonNull(metricsDataStatus.pipelineMetricsCompleted())
				&& metricsDataStatus.pipelineMetricsCompleted()) {
			generatePipelineReport(request);
		}
		if (Objects.nonNull(metricsDataStatus.sourceControlMetricsCompleted())
				&& metricsDataStatus.sourceControlMetricsCompleted()) {
			generateSourceControlReport(request);
		}
		generateCsvForDora(request);
	}

	private void generatePipelineReport(GenerateReportRequest request) {
		GenerateReportRequest pipelineRequest = request.convertToPipelineRequest(request);
		String pipelineReportId = IdUtil.getPipelineReportId(request.getCsvTimeStamp());
		log.info(
				"Start to generate pipeline report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _pipelineReportId: {}",
				pipelineRequest.getMetrics(), pipelineRequest.getConsiderHoliday(), pipelineRequest.getStartTime(),
				pipelineRequest.getEndTime(), pipelineReportId);
		try {
			saveReporterInHandler(generateReporter(pipelineRequest), pipelineReportId);
			updateMetricsDataCompletedInHandler(pipelineRequest.getCsvTimeStamp(), pipelineRequest.getMetrics());
			log.info(
					"Successfully generate pipeline report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _pipelineReportId: {}",
					pipelineRequest.getMetrics(), pipelineRequest.getConsiderHoliday(), pipelineRequest.getStartTime(),
					pipelineRequest.getEndTime(), pipelineReportId);
		}
		catch (BaseException e) {
			handleException(pipelineRequest, pipelineReportId, e);
		}
	}

	private void generateSourceControlReport(GenerateReportRequest request) {
		GenerateReportRequest sourceControlRequest = request.convertToSourceControlRequest(request);
		String sourceControlReportId = IdUtil.getSourceControlReportId(request.getCsvTimeStamp());
		log.info(
				"Start to generate source control report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _sourceControlReportId: {}",
				sourceControlRequest.getMetrics(), sourceControlRequest.getConsiderHoliday(),
				sourceControlRequest.getStartTime(), sourceControlRequest.getEndTime(), sourceControlReportId);
		try {
			saveReporterInHandler(generateReporter(sourceControlRequest), sourceControlReportId);
			updateMetricsDataCompletedInHandler(sourceControlRequest.getCsvTimeStamp(),
					sourceControlRequest.getMetrics());
			log.info(
					"Successfully generate source control report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _sourceControlReportId: {}",
					sourceControlRequest.getMetrics(), sourceControlRequest.getConsiderHoliday(),
					sourceControlRequest.getStartTime(), sourceControlRequest.getEndTime(), sourceControlReportId);
		}
		catch (BaseException e) {
			handleException(sourceControlRequest, sourceControlReportId, e);
		}
	}

	private void removePreviousAsyncException(String reportId) {
		asyncExceptionHandler.remove(reportId);
	}

	public synchronized ReportResponse generateReporter(GenerateReportRequest request) {
		workDay.changeConsiderHolidayMode(request.getConsiderHoliday());
		// fetch data for calculate
		List<String> lowMetrics = request.getMetrics().stream().map(String::toLowerCase).toList();
		FetchedData fetchedData = fetchOriginalData(request, lowMetrics);

		ReportResponse reportResponse = new ReportResponse(EXPORT_CSV_VALIDITY_TIME);
		JiraBoardSetting jiraBoardSetting = request.getJiraBoardSetting();

		request.getMetrics().forEach(metrics -> {
			switch (metrics.toLowerCase()) {
				case "velocity" -> reportResponse.setVelocity(velocityCalculator
					.calculateVelocity(fetchedData.getCardCollectionInfo().getRealDoneCardCollection()));
				case "cycle time" -> reportResponse.setCycleTime(cycleTimeCalculator.calculateCycleTime(
						fetchedData.getCardCollectionInfo().getRealDoneCardCollection(),
						jiraBoardSetting.getBoardColumns()));
				case "classification" -> reportResponse
					.setClassificationList(classificationCalculator.calculate(jiraBoardSetting.getTargetFields(),
							fetchedData.getCardCollectionInfo().getRealDoneCardCollection()));
				case "deployment frequency" -> reportResponse.setDeploymentFrequency(
						deploymentFrequency.calculate(fetchedData.getBuildKiteData().getDeployTimesList(),
								Long.parseLong(request.getStartTime()), Long.parseLong(request.getEndTime())));
				case "change failure rate" -> reportResponse.setChangeFailureRate(
						changeFailureRate.calculate(fetchedData.getBuildKiteData().getDeployTimesList()));
				case "mean time to recovery" -> reportResponse.setMeanTimeToRecovery(
						meanToRecoveryCalculator.calculate(fetchedData.getBuildKiteData().getDeployTimesList()));
				case "lead time for changes" -> reportResponse.setLeadTimeForChanges(
						leadTimeForChangesCalculator.calculate(fetchedData.getBuildKiteData().getPipelineLeadTimes()));
				default -> {
					// TODO
				}
			}
		});

		return reportResponse;
	}

	private FetchedData fetchOriginalData(GenerateReportRequest request, List<String> lowMetrics) {
		FetchedData fetchedData = new FetchedData();

		if (CollectionUtils.isNotEmpty(MetricsUtil.getBoardMetrics(lowMetrics))) {
			if (request.getJiraBoardSetting() == null)
				throw new BadRequestException("Failed to fetch Jira info due to Jira board setting is null.");
			CardCollectionInfo cardCollectionInfo = fetchDataFromKanban(request);
			fetchedData.setCardCollectionInfo(cardCollectionInfo);
		}

		if (CollectionUtils.isNotEmpty(MetricsUtil.getCodeBaseMetrics(lowMetrics))) {
			if (request.getCodebaseSetting() == null)
				throw new BadRequestException("Failed to fetch Github info due to code base setting is null.");
			BuildKiteData buildKiteData = fetchGithubData(request);
			fetchedData.setBuildKiteData(buildKiteData);
		}

		if (CollectionUtils.isNotEmpty(MetricsUtil.getPipelineMetrics(lowMetrics))) {
			if (request.getBuildKiteSetting() == null)
				throw new BadRequestException("Failed to fetch BuildKite info due to BuildKite setting is null.");
			FetchedData.BuildKiteData buildKiteData = fetchBuildKiteInfo(request);
			val cachedBuildKiteData = fetchedData.getBuildKiteData();
			if (cachedBuildKiteData != null) {
				val pipelineLeadTimes = cachedBuildKiteData.getPipelineLeadTimes();
				buildKiteData.setPipelineLeadTimes(pipelineLeadTimes);
			}
			fetchedData.setBuildKiteData(buildKiteData);
		}

		return fetchedData;
	}

	public void generateCsvForDora(GenerateReportRequest request) {
		List<String> lowMetrics = request.getMetrics().stream().map(String::toLowerCase).toList();
		FetchedData fetchedData = fetchOriginalData(request, lowMetrics);

		generateCSVForPipeline(request, fetchedData.getBuildKiteData());

	}

	private CardCollection fetchRealDoneCardCollection(GenerateReportRequest request) {
		JiraBoardSetting jiraBoardSetting = request.getJiraBoardSetting();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = buildStoryPointsAndCycleTimeRequest(
				jiraBoardSetting, request.getStartTime(), request.getEndTime());
		return jiraService.getStoryPointsAndCycleTimeForDoneCards(storyPointsAndCycleTimeRequest,
				jiraBoardSetting.getBoardColumns(), jiraBoardSetting.getUsers(), jiraBoardSetting.getAssigneeFilter());
	}

	private CardCollection fetchNonDoneCardCollection(GenerateReportRequest request) {
		JiraBoardSetting jiraBoardSetting = request.getJiraBoardSetting();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = buildStoryPointsAndCycleTimeRequest(
				jiraBoardSetting, request.getStartTime(), request.getEndTime());
		return jiraService.getStoryPointsAndCycleTimeForNonDoneCards(storyPointsAndCycleTimeRequest,
				jiraBoardSetting.getBoardColumns(), jiraBoardSetting.getUsers());
	}

	private CardCollectionInfo fetchDataFromKanban(GenerateReportRequest request) {
		JiraBoardSetting jiraBoardSetting = request.getJiraBoardSetting();
		BoardRequestParam boardRequestParam = BoardRequestParam.builder()
			.boardId(jiraBoardSetting.getBoardId())
			.projectKey(jiraBoardSetting.getProjectKey())
			.site(jiraBoardSetting.getSite())
			.token(jiraBoardSetting.getToken())
			.startTime(request.getStartTime())
			.endTime(request.getEndTime())
			.build();
		CardCollection nonDoneCardCollection = fetchNonDoneCardCollection(request);
		CardCollection realDoneCardCollection = fetchRealDoneCardCollection(request);

		CardCollectionInfo collectionInfo = CardCollectionInfo.builder()
			.realDoneCardCollection(realDoneCardCollection)
			.nonDoneCardCollection(nonDoneCardCollection)
			.build();

		URI baseUrl = urlGenerator.getUri(boardRequestParam.getSite());

		JiraBoardConfigDTO jiraBoardConfigDTO = jiraService.getJiraBoardConfig(baseUrl, boardRequestParam.getBoardId(),
				boardRequestParam.getToken());
		JiraColumnResult jiraColumns = jiraService.getJiraColumns(boardRequestParam, baseUrl, jiraBoardConfigDTO);

		generateCSVForBoard(realDoneCardCollection.getJiraCardDTOList(), nonDoneCardCollection.getJiraCardDTOList(),
				jiraColumns.getJiraColumnResponse(), jiraBoardSetting.getTargetFields(), request.getCsvTimeStamp());
		return collectionInfo;
	}

	private void generateCSVForBoard(List<JiraCardDTO> allDoneCards, List<JiraCardDTO> nonDoneCards,
			List<JiraColumnDTO> jiraColumns, List<TargetField> targetFields, String csvTimeStamp) {
		List<JiraCardDTO> cardDTOList = new ArrayList<>();
		List<JiraCardDTO> emptyJiraCard = List.of(JiraCardDTO.builder().build());
		cardDTOList.addAll(allDoneCards);
		cardDTOList.addAll(emptyJiraCard);

		if (nonDoneCards != null) {
			if (nonDoneCards.size() > 1) {
				nonDoneCards.sort((preCard, nextCard) -> {
					Status preStatus = preCard.getBaseInfo().getFields().getStatus();
					Status nextStatus = nextCard.getBaseInfo().getFields().getStatus();
					if (preStatus == null || nextStatus == null) {
						return jiraColumns.size() + 1;
					}
					else {
						String preCardName = preStatus.getName();
						String nextCardName = nextStatus.getName();
						return getIndexForStatus(jiraColumns, nextCardName)
								- getIndexForStatus(jiraColumns, preCardName);
					}
				});
			}
			cardDTOList.addAll(nonDoneCards);
		}
		List<String> columns = cardDTOList.stream().flatMap(cardDTO -> {
			if (cardDTO.getOriginCycleTime() != null) {
				return cardDTO.getOriginCycleTime().stream();
			}
			else {
				return Stream.empty();
			}
		}).map(CycleTimeInfo::getColumn).distinct().toList();

		List<TargetField> activeTargetFields = targetFields.stream().filter(TargetField::isFlag).toList();

		List<BoardCSVConfig> fields = getFixedBoardFields();
		List<BoardCSVConfig> extraFields = getExtraFields(activeTargetFields, fields);

		List<BoardCSVConfig> newExtraFields = updateExtraFields(extraFields, cardDTOList);
		List<BoardCSVConfig> allBoardFields = insertExtraFields(newExtraFields, fields);

		columns.forEach(column -> allBoardFields.add(
				BoardCSVConfig.builder().label("OriginCycleTime: " + column).value("cycleTimeFlat." + column).build()));

		cardDTOList.forEach(card -> {
			card.setCycleTimeFlat(buildCycleTimeFlatObject(card));
			card.setTotalCycleTimeDivideStoryPoints(calculateTotalCycleTimeDivideStoryPoints(card));
		});
		csvFileGenerator.convertBoardDataToCSV(cardDTOList, allBoardFields, newExtraFields, csvTimeStamp);
	}

	private String calculateTotalCycleTimeDivideStoryPoints(JiraCardDTO card) {
		if (card.getBaseInfo() == null || card.getCardCycleTime() == null) {
			return "";
		}
		double storyPoints = card.getBaseInfo().getFields().getStoryPoints();
		double cardCycleTime = card.getCardCycleTime().getTotal() == 0.0 ? 0.0 : card.getCardCycleTime().getTotal();

		String formattedResult = DecimalUtil.formatDecimalTwo(cardCycleTime / storyPoints);
		return storyPoints > 0.0 ? formattedResult : "";
	}

	private Object buildCycleTimeFlatObject(JiraCardDTO card) {
		if (card.getOriginCycleTime() == null) {
			return null;
		}
		HashMap<String, Double> cycleTimeFlat = new HashMap<>();
		for (int j = 0; j < card.getOriginCycleTime().size(); j++) {
			CycleTimeInfo cycleTimeInfo = card.getOriginCycleTime().get(j);
			cycleTimeFlat.put(cycleTimeInfo.getColumn().trim(), cycleTimeInfo.getDay());
		}
		return cycleTimeFlat;
	}

	private List<BoardCSVConfig> insertExtraFields(List<BoardCSVConfig> extraFields,
			List<BoardCSVConfig> currentFields) {
		List<BoardCSVConfig> modifiedFields = new ArrayList<>(currentFields);
		int insertIndex = 0;
		for (int i = 0; i < modifiedFields.size(); i++) {
			BoardCSVConfig currentField = modifiedFields.get(i);
			if (currentField.getLabel().equals("Cycle Time")) {
				insertIndex = i + 1;
				break;
			}
		}
		modifiedFields.addAll(insertIndex, extraFields);
		return modifiedFields;
	}

	private List<BoardCSVConfig> updateExtraFields(List<BoardCSVConfig> extraFields, List<JiraCardDTO> cardDTOList) {
		List<BoardCSVConfig> updatedFields = new ArrayList<>();
		for (BoardCSVConfig field : extraFields) {
			boolean hasUpdated = false;
			for (JiraCardDTO card : cardDTOList) {
				if (card.getBaseInfo() != null) {
					Map<String, Object> tempFields = extractFields(card.getBaseInfo().getFields());
					if (!hasUpdated && field.getOriginKey() != null) {
						Object object = tempFields.get(field.getOriginKey());
						String extendField = getFieldDisplayValue(object);
						if (extendField != null) {
							field.setValue(field.getValue() + extendField);
							hasUpdated = true;
						}
					}
				}
			}
			updatedFields.add(field);
		}
		return updatedFields;
	}

	private Map<String, Object> extractFields(JiraCardField jiraCardFields) {
		Map<String, Object> tempFields = new HashMap<>(jiraCardFields.getCustomFields());

		for (String fieldName : FIELD_NAMES) {
			switch (fieldName) {
				case "assignee" -> tempFields.put(fieldName, jiraCardFields.getAssignee());
				case "summary" -> tempFields.put(fieldName, jiraCardFields.getSummary());
				case "status" -> tempFields.put(fieldName, jiraCardFields.getStatus());
				case "issuetype" -> tempFields.put(fieldName, jiraCardFields.getIssuetype());
				case "reporter" -> tempFields.put(fieldName, jiraCardFields.getReporter());
				case "statusCategoryChangeData" ->
					tempFields.put(fieldName, jiraCardFields.getStatusCategoryChangeDate());
				case "storyPoints" -> tempFields.put(fieldName, jiraCardFields.getStoryPoints());
				case "fixVersions" -> tempFields.put(fieldName, jiraCardFields.getFixVersions());
				case "project" -> tempFields.put(fieldName, jiraCardFields.getProject());
				case "parent" -> tempFields.put(fieldName, jiraCardFields.getParent());
				case "priority" -> tempFields.put(fieldName, jiraCardFields.getPriority());
				case "labels" -> tempFields.put(fieldName, jiraCardFields.getLabels());
				default -> {
				}
			}
		}
		return tempFields;
	}

	private int getIndexForStatus(List<JiraColumnDTO> jiraColumns, String name) {
		for (int index = 0; index < jiraColumns.size(); index++) {
			List<String> statuses = jiraColumns.get(index).getValue().getStatuses();
			if (statuses.contains(name.toUpperCase())) {
				return index;
			}
		}
		return jiraColumns.size();
	}

	private List<BoardCSVConfig> getExtraFields(List<TargetField> targetFields, List<BoardCSVConfig> currentFields) {
		List<BoardCSVConfig> extraFields = new ArrayList<>();
		for (TargetField targetField : targetFields) {
			boolean isInCurrentFields = false;
			for (BoardCSVConfig currentField : currentFields) {
				if (currentField.getLabel().equalsIgnoreCase(targetField.getName())
						|| currentField.getValue().contains(targetField.getKey())) {
					isInCurrentFields = true;
					break;
				}
			}
			if (!isInCurrentFields) {
				BoardCSVConfig extraField = new BoardCSVConfig();
				extraField.setLabel(targetField.getName());
				extraField.setValue("baseInfo.fields.customFields." + targetField.getKey());
				extraField.setOriginKey(targetField.getKey());
				extraFields.add(extraField);
			}
		}
		return extraFields;
	}

	private FetchedData.BuildKiteData fetchGithubData(GenerateReportRequest request) {
		FetchedData.BuildKiteData buildKiteData = fetchBuildKiteData(request.getStartTime(), request.getEndTime(),
				request.getBuildKiteSetting().getDeploymentEnvList(), request.getBuildKiteSetting().getToken(),
				request.getBuildKiteSetting().getPipelineCrews());
		Map<String, String> repoMap = getRepoMap(request.getBuildKiteSetting().getDeploymentEnvList());
		List<PipelineLeadTime> pipelineLeadTimes = Collections.emptyList();
		if (Objects.nonNull(request.getCodebaseSetting())
				&& StringUtils.hasLength(request.getCodebaseSetting().getToken())) {
			pipelineLeadTimes = gitHubService.fetchPipelinesLeadTime(buildKiteData.getDeployTimesList(), repoMap,
					request.getCodebaseSetting().getToken());
		}
		return BuildKiteData.builder()
			.pipelineLeadTimes(pipelineLeadTimes)
			.buildInfosList(buildKiteData.getBuildInfosList())
			.deployTimesList(buildKiteData.getDeployTimesList())
			.leadTimeBuildInfosList(buildKiteData.getLeadTimeBuildInfosList())
			.build();
	}

	private FetchedData.BuildKiteData fetchBuildKiteInfo(GenerateReportRequest request) {
		return fetchBuildKiteData(request.getStartTime(), request.getEndTime(),
				request.getBuildKiteSetting().getDeploymentEnvList(), request.getBuildKiteSetting().getToken(),
				request.getBuildKiteSetting().getPipelineCrews());
	}

	private FetchedData.BuildKiteData fetchBuildKiteData(String startTime, String endTime,
			List<DeploymentEnvironment> deploymentEnvironments, String token, List<String> pipelineCrews) {
		List<DeployTimes> deployTimesList = new ArrayList<>();
		List<Map.Entry<String, List<BuildKiteBuildInfo>>> buildInfosList = new ArrayList<>();
		List<Map.Entry<String, List<BuildKiteBuildInfo>>> leadTimeBuildInfosList = new ArrayList<>();

		for (DeploymentEnvironment deploymentEnvironment : deploymentEnvironments) {
			List<BuildKiteBuildInfo> buildKiteBuildInfo = getBuildKiteBuildInfo(startTime, endTime,
					deploymentEnvironment, token, pipelineCrews);
			DeployTimes deployTimes = buildKiteService.countDeployTimes(deploymentEnvironment, buildKiteBuildInfo,
					startTime, endTime);
			deployTimesList.add(deployTimes);
			buildInfosList.add(Map.entry(deploymentEnvironment.getId(), buildKiteBuildInfo));
			leadTimeBuildInfosList.add(Map.entry(deploymentEnvironment.getId(), buildKiteBuildInfo));
		}
		return BuildKiteData.builder()
			.deployTimesList(deployTimesList)
			.buildInfosList(buildInfosList)
			.leadTimeBuildInfosList(leadTimeBuildInfosList)
			.build();
	}

	private List<BuildKiteBuildInfo> getBuildKiteBuildInfo(String startTime, String endTime,
			DeploymentEnvironment deploymentEnvironment, String token, List<String> pipelineCrews) {
		List<BuildKiteBuildInfo> buildKiteBuildInfo = buildKiteService
			.fetchPipelineBuilds(token, deploymentEnvironment, startTime, endTime)
			.stream()
			.filter(info -> Objects.nonNull(info.getAuthor()))
			.toList();

		if (!CollectionUtils.isEmpty(pipelineCrews)) {
			buildKiteBuildInfo = buildKiteBuildInfo.stream()
				.filter(info -> pipelineCrews.contains(info.getAuthor().getName()))
				.toList();
		}
		return buildKiteBuildInfo;
	}

	private void generateCSVForPipeline(GenerateReportRequest request, BuildKiteData buildKiteData) {
		List<PipelineCSVInfo> pipelineData = generateCSVForPipelineWithCodebase(request.getCodebaseSetting(),
				request.getStartTime(), request.getEndTime(), buildKiteData,
				request.getBuildKiteSetting().getDeploymentEnvList());

		csvFileGenerator.convertPipelineDataToCSV(pipelineData, request.getCsvTimeStamp());
	}

	public void generateCSVForMetric(ReportResponse reportContent, String csvTimeStamp) {
		csvFileGenerator.convertMetricDataToCSV(reportContent, csvTimeStamp);
	}

	public void saveReporterInHandler(ReportResponse reportContent, String reportId) {
		asyncReportRequestHandler.putReport(reportId, reportContent);
	}

	public void initializeMetricsDataCompletedInHandler(String timeStamp, List<String> metrics) {
		MetricsDataCompleted metricsStatus = getMetricsStatus(metrics, Boolean.FALSE);
		MetricsDataCompleted previousMetricsCompleted = asyncReportRequestHandler.getMetricsDataCompleted(timeStamp);
		MetricsDataCompleted isMetricsDataCompleted = createMetricsDataCompleted(metricsStatus.boardMetricsCompleted(),
				metricsStatus.sourceControlMetricsCompleted(), metricsStatus.pipelineMetricsCompleted(),
				previousMetricsCompleted);
		asyncReportRequestHandler.putMetricsDataCompleted(timeStamp, isMetricsDataCompleted);
	}

	private MetricsDataCompleted createMetricsDataCompleted(Boolean boardMetricsCompleted,
			Boolean sourceControlMetricsCompleted, Boolean pipelineMetricsCompleted,
			MetricsDataCompleted previousMetricsCompleted) {
		if (previousMetricsCompleted == null) {
			return MetricsDataCompleted.builder()
				.boardMetricsCompleted(boardMetricsCompleted)
				.pipelineMetricsCompleted(pipelineMetricsCompleted)
				.sourceControlMetricsCompleted(sourceControlMetricsCompleted)
				.build();
		}

		return MetricsDataCompleted.builder()
			.boardMetricsCompleted(
					getCompletedValue(previousMetricsCompleted.boardMetricsCompleted(), boardMetricsCompleted))
			.pipelineMetricsCompleted(
					getCompletedValue(previousMetricsCompleted.pipelineMetricsCompleted(), pipelineMetricsCompleted))
			.sourceControlMetricsCompleted(getCompletedValue(previousMetricsCompleted.sourceControlMetricsCompleted(),
					sourceControlMetricsCompleted))
			.build();

	}

	private Boolean getCompletedValue(Boolean previousCompletedValue, Boolean newCompletedValue) {
		return newCompletedValue == null ? previousCompletedValue : newCompletedValue;
	}

	public void updateMetricsDataCompletedInHandler(String timeStamp, List<String> metrics) {
		MetricsDataCompleted metricsStatus = getMetricsStatus(metrics, Boolean.TRUE);
		MetricsDataCompleted previousMetricsCompleted = asyncReportRequestHandler.getMetricsDataCompleted(timeStamp);
		if (previousMetricsCompleted == null) {
			log.error("Failed to update metrics data completed through this timestamp.");
			throw new GenerateReportException("Failed to update metrics data completed through this timestamp.");
		}
		MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder()
			.boardMetricsCompleted(checkCurrentMetricsCompletedState(metricsStatus.boardMetricsCompleted(),
					previousMetricsCompleted.boardMetricsCompleted()))
			.pipelineMetricsCompleted(checkCurrentMetricsCompletedState(metricsStatus.pipelineMetricsCompleted(),
					previousMetricsCompleted.pipelineMetricsCompleted()))
			.sourceControlMetricsCompleted(
					checkCurrentMetricsCompletedState(metricsStatus.sourceControlMetricsCompleted(),
							previousMetricsCompleted.sourceControlMetricsCompleted()))
			.build();
		asyncReportRequestHandler.putMetricsDataCompleted(timeStamp, metricsDataCompleted);
	}

	private Boolean checkCurrentMetricsCompletedState(Boolean exist, Boolean previousValue) {
		if (Boolean.TRUE.equals(exist) && Objects.nonNull(previousValue))
			return Boolean.TRUE;
		return previousValue;
	}

	private MetricsDataCompleted getMetricsStatus(List<String> metrics, Boolean flag) {
		List<String> lowerMetrics = metrics.stream().map(String::toLowerCase).toList();
		boolean boardMetricsExist = CollectionUtils.isNotEmpty(MetricsUtil.getBoardMetrics(lowerMetrics));
		boolean codebaseMetricsExist = CollectionUtils.isNotEmpty(MetricsUtil.getCodeBaseMetrics(lowerMetrics));
		boolean buildKiteMetricsExist = CollectionUtils.isNotEmpty(MetricsUtil.getPipelineMetrics(lowerMetrics));
		Boolean isBoardMetricsReady = boardMetricsExist ? flag : null;
		Boolean isPipelineMetricsReady = buildKiteMetricsExist ? flag : null;
		Boolean isSourceControlMetricsReady = codebaseMetricsExist ? flag : null;
		return MetricsDataCompleted.builder()
			.boardMetricsCompleted(isBoardMetricsReady)
			.pipelineMetricsCompleted(isPipelineMetricsReady)
			.sourceControlMetricsCompleted(isSourceControlMetricsReady)
			.build();
	}

	private boolean isBuildInfoValid(BuildKiteBuildInfo buildInfo, DeploymentEnvironment deploymentEnvironment,
			List<String> steps, String startTime, String endTime) {
		BuildKiteJob buildKiteJob = buildInfo.getBuildKiteJob(buildInfo.getJobs(),
				buildKiteService.getStepsBeforeEndStep(deploymentEnvironment.getStep(), steps), REQUIRED_STATES,
				startTime, endTime);
		return buildKiteJob != null && !buildInfo.getCommit().isEmpty();
	}

	private List<BuildKiteBuildInfo> getBuildInfos(List<Entry<String, List<BuildKiteBuildInfo>>> buildInfosList,
			DeploymentEnvironment deploymentEnvironment) {
		return buildInfosList.stream()
			.filter(entry -> entry.getKey().equals(deploymentEnvironment.getId()))
			.findFirst()
			.map(Map.Entry::getValue)
			.orElse(new ArrayList<>());
	}

	private LeadTime filterLeadTime(BuildKiteData buildKiteData, DeploymentEnvironment deploymentEnvironment,
			DeployInfo deployInfo) {
		if (Objects.isNull(buildKiteData.getPipelineLeadTimes())) {
			return null;
		}
		return buildKiteData.getPipelineLeadTimes()
			.stream()
			.filter(pipelineLeadTime -> Objects.equals(pipelineLeadTime.getPipelineName(),
					deploymentEnvironment.getName()))
			.flatMap(filteredPipeLineLeadTime -> filteredPipeLineLeadTime.getLeadTimes().stream())
			.filter(leadTime -> leadTime.getCommitId().equals(deployInfo.getCommitId()))
			.findFirst()
			.orElse(null);
	}

	private List<PipelineCSVInfo> generateCSVForPipelineWithCodebase(CodebaseSetting codebaseSetting, String startTime,
			String endTime, BuildKiteData buildKiteData, List<DeploymentEnvironment> deploymentEnvironments) {
		List<PipelineCSVInfo> pipelineCSVInfos = new ArrayList<>();

		Map<String, String> repoIdMap = getRepoMap(deploymentEnvironments);
		for (DeploymentEnvironment deploymentEnvironment : deploymentEnvironments) {
			String repoId = GithubUtil.getGithubUrlFullName(repoIdMap.get(deploymentEnvironment.getId()));
			List<BuildKiteBuildInfo> buildInfos = getBuildInfos(buildKiteData.getBuildInfosList(),
					deploymentEnvironment);
			List<String> pipelineSteps = buildKiteService.getPipelineStepNames(buildInfos);

			List<PipelineCSVInfo> pipelineCSVInfoList = buildInfos.stream()
				.filter(buildInfo -> isBuildInfoValid(buildInfo, deploymentEnvironment, pipelineSteps, startTime,
						endTime))
				.map(buildInfo -> {
					DeployInfo deployInfo = buildInfo.mapToDeployInfo(
							buildKiteService.getStepsBeforeEndStep(deploymentEnvironment.getStep(), pipelineSteps),
							REQUIRED_STATES, startTime, endTime);
					LeadTime filteredLeadTime = filterLeadTime(buildKiteData, deploymentEnvironment, deployInfo);
					CommitInfo commitInfo = null;
					if (Objects.nonNull(codebaseSetting) && StringUtils.hasLength(codebaseSetting.getToken())
							&& Objects.nonNull(deployInfo.getCommitId())) {
						commitInfo = gitHubService.fetchCommitInfo(deployInfo.getCommitId(), repoId,
								codebaseSetting.getToken());
					}
					return PipelineCSVInfo.builder()
						.pipeLineName(deploymentEnvironment.getName())
						.stepName(deployInfo.getJobName())
						.buildInfo(buildInfo)
						.deployInfo(deployInfo)
						.commitInfo(commitInfo)
						.leadTimeInfo(new LeadTimeInfo(filteredLeadTime))
						.build();
				})
				.toList();
			pipelineCSVInfos.addAll(pipelineCSVInfoList);
		}
		return pipelineCSVInfos;
	}

	public boolean checkGenerateReportIsDone(String reportTimeStamp) {
		if (validateExpire(System.currentTimeMillis(), Long.parseLong(reportTimeStamp))) {
			throw new GenerateReportException("Failed to get report due to report time expires");
		}
		return asyncReportRequestHandler.isReportReady(reportTimeStamp);
	}

	private ErrorInfo handleAsyncExceptionAndGetErrorInfo(BaseException exception) {
		if (Objects.nonNull(exception)) {
			int status = exception.getStatus();
			final String errorMessage = exception.getMessage();
			switch (status) {
				case 401, 403, 404 -> {
					return ErrorInfo.builder().status(status).errorMessage(errorMessage).build();
				}
				case 500 -> throw new GenerateReportException(errorMessage);
				case 503 -> throw new ServiceUnavailableException(errorMessage);
				default -> throw new RequestFailedException(status, errorMessage);
			}
		}
		return null;
	}

	private void deleteOldCSV(long currentTimeStamp, File directory) {
		File[] files = directory.listFiles();
		if (!ObjectUtils.isEmpty(files)) {
			for (File file : files) {
				String fileName = file.getName();
				String[] splitResult = fileName.split("\\s*\\-|\\.\\s*");
				String timeStamp = splitResult[1];
				if (validateExpire(currentTimeStamp, Long.parseLong(timeStamp)) && !file.delete()) {
					log.error("Failed to deleted expired CSV file, file name: {}", fileName);
				}
			}
		}
	}

	private boolean validateExpire(long currentTimeStamp, long timeStamp) {
		return timeStamp < currentTimeStamp - EXPORT_CSV_VALIDITY_TIME;
	}

	public Boolean deleteExpireCSV(Long currentTimeStamp, File directory) {
		try {
			deleteOldCSV(currentTimeStamp, directory);
			log.info("Successfully deleted expired CSV files, currentTimeStamp: {}", currentTimeStamp);
			return true;
		}
		catch (Exception exception) {
			Throwable cause = Optional.ofNullable(exception.getCause()).orElse(exception);
			log.error("Failed to deleted expired CSV files, currentTimeStamp：{}, exception: {}", currentTimeStamp,
					cause.getMessage());
			return false;
		}
	}

	public ReportResponse getReportFromHandler(String reportId) {
		return asyncReportRequestHandler.getReport(reportId);
	}

	public ReportResponse getComposedReportResponse(String reportId, boolean isReportReady) {
		ReportResponse boardReportResponse = getReportFromHandler(IdUtil.getBoardReportId(reportId));
		ReportResponse doraReportResponse = getReportFromHandler(IdUtil.getPipelineReportId(reportId));
		ReportResponse codebaseReportResponse = getReportFromHandler(IdUtil.getSourceControlReportId(reportId));
		MetricsDataCompleted metricsDataCompleted = asyncReportRequestHandler.getMetricsDataCompleted(reportId);
		ReportResponse response = Optional.ofNullable(boardReportResponse).orElse(doraReportResponse);
		ReportError reportError = getReportErrorAndHandleAsyncException(reportId);

		return ReportResponse.builder()
			.velocity(getValueOrNull(boardReportResponse, ReportResponse::getVelocity))
			.classificationList(getValueOrNull(boardReportResponse, ReportResponse::getClassificationList))
			.cycleTime(getValueOrNull(boardReportResponse, ReportResponse::getCycleTime))
			.exportValidityTime(getValueOrNull(response, ReportResponse::getExportValidityTime))
			.deploymentFrequency(getValueOrNull(doraReportResponse, ReportResponse::getDeploymentFrequency))
			.changeFailureRate(getValueOrNull(doraReportResponse, ReportResponse::getChangeFailureRate))
			.meanTimeToRecovery(getValueOrNull(doraReportResponse, ReportResponse::getMeanTimeToRecovery))
			.leadTimeForChanges(getValueOrNull(codebaseReportResponse, ReportResponse::getLeadTimeForChanges))
			.boardMetricsCompleted(getValueOrNull(metricsDataCompleted, MetricsDataCompleted::boardMetricsCompleted))
			.pipelineMetricsCompleted(
					getValueOrNull(metricsDataCompleted, MetricsDataCompleted::pipelineMetricsCompleted))
			.sourceControlMetricsCompleted(
					getValueOrNull(metricsDataCompleted, MetricsDataCompleted::sourceControlMetricsCompleted))
			.allMetricsCompleted(isReportReady)
			.reportError(reportError)
			.build();
	}

	public ReportError getReportErrorAndHandleAsyncException(String reportId) {
		BaseException boardException = asyncExceptionHandler.get(IdUtil.getBoardReportId(reportId));
		BaseException pipelineException = asyncExceptionHandler.get(IdUtil.getPipelineReportId(reportId));
		BaseException sourceControlException = asyncExceptionHandler.get(IdUtil.getSourceControlReportId(reportId));
		ErrorInfo boardError = handleAsyncExceptionAndGetErrorInfo(boardException);
		ErrorInfo pipelineError = handleAsyncExceptionAndGetErrorInfo(pipelineException);
		ErrorInfo sourceControlError = handleAsyncExceptionAndGetErrorInfo(sourceControlException);
		return ReportError.builder()
			.boardError(boardError)
			.pipelineError(pipelineError)
			.sourceControlError(sourceControlError)
			.build();
	}

	private <T, R> R getValueOrNull(T object, Function<T, R> getter) {
		return object != null ? getter.apply(object) : null;
	}

}
