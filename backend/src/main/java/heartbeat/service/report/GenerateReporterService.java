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
import heartbeat.controller.report.dto.request.RequireDataEnum;
import heartbeat.controller.report.dto.response.BoardCSVConfig;
import heartbeat.controller.report.dto.response.BoardCSVConfigEnum;
import heartbeat.controller.report.dto.response.LeadTimeInfo;
import heartbeat.controller.report.dto.response.PipelineCSVInfo;
import heartbeat.controller.report.dto.response.ReportResponse;
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
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GenerateReporterService {

	private static final String[] FIELD_NAMES = { "assignee", "summary", "status", "issuetype", "reporter",
			"timetracking", "statusCategoryChangeData", "storyPoints", "fixVersions", "project", "parent", "priority",
			"labels" };

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

	private final List<String> kanbanMetrics = Stream
		.of(RequireDataEnum.VELOCITY, RequireDataEnum.CYCLE_TIME, RequireDataEnum.CLASSIFICATION)
		.map(RequireDataEnum::getValue)
		.toList();

	private final List<String> buildKiteMetrics = Stream
		.of(RequireDataEnum.CHANGE_FAILURE_RATE, RequireDataEnum.DEPLOYMENT_FREQUENCY,
				RequireDataEnum.MEAN_TIME_TO_RECOVERY)
		.map(RequireDataEnum::getValue)
		.toList();

	private final List<String> codebaseMetrics = Stream.of(RequireDataEnum.LEAD_TIME_FOR_CHANGES)
		.map(RequireDataEnum::getValue)
		.toList();

	private static final List<String> REQUIRED_STATES = List.of("passed", "failed");

	private Map<String, String> getRepoMap(CodebaseSetting codebaseSetting) {
		Map<String, String> repoMap = new HashMap<>();
		for (DeploymentEnvironment currentValue : codebaseSetting.getLeadTime()) {
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

	public synchronized ReportResponse generateReporter(GenerateReportRequest request) {
		workDay.changeConsiderHolidayMode(request.getConsiderHoliday());
		// fetch data for calculate
		FetchedData fetchedData = fetchOriginalData(request);

		generateCSVForPipeline(request, fetchedData.getBuildKiteData());

		ReportResponse reportResponse = new ReportResponse();
		request.getMetrics().forEach((metrics) -> {
			switch (metrics.toLowerCase()) {
				case "velocity" -> reportResponse.setVelocity(
						velocityCalculator.calculateVelocity(fetchedData.getCardCollectionInfo().getCardCollection()));
				case "cycle time" -> reportResponse.setCycleTime(
						cycleTimeCalculator.calculateCycleTime(fetchedData.getCardCollectionInfo().getCardCollection(),
								request.getJiraBoardSetting().getBoardColumns()));
				case "classification" -> reportResponse.setClassificationList(
						classificationCalculator.calculate(request.getJiraBoardSetting().getTargetFields(),
								fetchedData.getCardCollectionInfo().getCardCollection()));
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

	private FetchedData fetchOriginalData(GenerateReportRequest request) {
		List<String> lowMetrics = request.getMetrics().stream().map(String::toLowerCase).toList();
		FetchedData fetchedData = new FetchedData();

		if (lowMetrics.stream().anyMatch(this.kanbanMetrics::contains)) {
			CardCollectionInfo cardCollectionInfo = fetchDataFromKanban(request);
			fetchedData.setCardCollectionInfo(cardCollectionInfo);
		}

		if (lowMetrics.stream().anyMatch(this.codebaseMetrics::contains)) {
			BuildKiteData buildKiteData = fetchGithubData(request);
			fetchedData.setBuildKiteData(buildKiteData);
		}

		if (lowMetrics.stream().anyMatch(this.buildKiteMetrics::contains)) {
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

	private CardCollection fetchCardCollection(GenerateReportRequest request) {
		JiraBoardSetting jiraBoardSetting = request.getJiraBoardSetting();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = getStoryPointsAndCycleTimeRequest(request,
				jiraBoardSetting);
		return jiraService.getStoryPointsAndCycleTime(storyPointsAndCycleTimeRequest,
				jiraBoardSetting.getBoardColumns(), jiraBoardSetting.getUsers());
	}

	private CardCollection fetchNonDoneCardCollection(GenerateReportRequest request) {
		JiraBoardSetting jiraBoardSetting = request.getJiraBoardSetting();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = getStoryPointsAndCycleTimeRequest(request,
				jiraBoardSetting);
		return jiraService.getStoryPointsAndCycleTimeForNonDoneCards(storyPointsAndCycleTimeRequest);
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
		CardCollection cardCollection = fetchCardCollection(request);

		CardCollectionInfo collectionInfo = CardCollectionInfo.builder()
			.cardCollection(cardCollection)
			.nonDoneCardCollection(nonDoneCardCollection)
			.build();

		URI baseUrl = urlGenerator.getUri(boardRequestParam.getSite());

		JiraBoardConfigDTO jiraBoardConfigDTO = jiraService.getJiraBoardConfig(baseUrl, boardRequestParam.getBoardId(),
				boardRequestParam.getToken());
		JiraColumnResult jiraColumns = jiraService.getJiraColumns(boardRequestParam, baseUrl, jiraBoardConfigDTO);

		generateCSVForBoard(cardCollection.getJiraCardDTOList(), nonDoneCardCollection.getJiraCardDTOList(),
				jiraColumns.getJiraColumnResponse(), jiraBoardSetting.getTargetFields(), request.getCsvTimeStamp());
		return collectionInfo;
	}

	private static StoryPointsAndCycleTimeRequest getStoryPointsAndCycleTimeRequest(GenerateReportRequest request,
			JiraBoardSetting jiraBoardSetting) {
		return StoryPointsAndCycleTimeRequest.builder()
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

		List<TargetField> activeTargetFields = targetFields.stream()
			.filter(TargetField::isFlag)
			.collect(Collectors.toList());

		List<BoardCSVConfig> fields = getFixedBoardFields();
		List<BoardCSVConfig> extraFields = getExtraFields(activeTargetFields, fields);

		List<BoardCSVConfig> newExtraFields = updateExtraFields(extraFields, cardDTOList);
		List<BoardCSVConfig> allBoardFields = insertExtraFields(newExtraFields, fields);

		columns.forEach(column -> allBoardFields.add(
				BoardCSVConfig.builder().label("OriginCycleTime: " + column).value("cycleTimeFlat." + column).build()));

		cardDTOList.forEach((card) -> {
			card.setCycleTimeFlat(buildCycleTimeFlatObject(card));
			card.setTotalCycleTimeDivideStoryPoints(calculateTotalCycleTimeDivideStoryPoints(card));
		});
		csvFileGenerator.convertBoardDataToCSV(cardDTOList, allBoardFields, newExtraFields, csvTimeStamp);
	}

	private String calculateTotalCycleTimeDivideStoryPoints(JiraCardDTO card) {
		if (card.getBaseInfo() == null || card.getCardCycleTime() == null) {
			return "";
		}
		int storyPoints = card.getBaseInfo().getFields().getStoryPoints();
		double cardCycleTime = card.getCardCycleTime().getTotal() == 0.0 ? 0.0 : card.getCardCycleTime().getTotal();

		String formattedResult = DecimalUtil.formatDecimalTwo(cardCycleTime / storyPoints);
		return storyPoints > 0 ? formattedResult : "";
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
				request.getCodebaseSetting().getLeadTime(), request.getBuildKiteSetting().getToken());
		Map<String, String> repoMap = getRepoMap(request.getCodebaseSetting());
		List<PipelineLeadTime> pipelineLeadTimes = gitHubService.fetchPipelinesLeadTime(
				buildKiteData.getDeployTimesList(), repoMap, request.getCodebaseSetting().getToken());
		return BuildKiteData.builder()
			.pipelineLeadTimes(pipelineLeadTimes)
			.buildInfosList(buildKiteData.getBuildInfosList())
			.deployTimesList(buildKiteData.getDeployTimesList())
			.leadTimeBuildInfosList(buildKiteData.getLeadTimeBuildInfosList())
			.build();
	}

	private FetchedData.BuildKiteData fetchBuildKiteInfo(GenerateReportRequest request) {
		return fetchBuildKiteData(request.getStartTime(), request.getEndTime(),
				request.getBuildKiteSetting().getDeploymentEnvList(), request.getBuildKiteSetting().getToken());
	}

	private FetchedData.BuildKiteData fetchBuildKiteData(String startTime, String endTime,
			List<DeploymentEnvironment> deploymentEnvironments, String token) {
		List<DeployTimes> deployTimesList = new ArrayList<>();
		List<Map.Entry<String, List<BuildKiteBuildInfo>>> buildInfosList = new ArrayList<>();
		List<Map.Entry<String, List<BuildKiteBuildInfo>>> leadTimeBuildInfosList = new ArrayList<>();

		for (DeploymentEnvironment deploymentEnvironment : deploymentEnvironments) {
			List<BuildKiteBuildInfo> buildKiteBuildInfos = buildKiteService.fetchPipelineBuilds(token,
					deploymentEnvironment, startTime, endTime);
			DeployTimes deployTimes = buildKiteService.countDeployTimes(deploymentEnvironment, buildKiteBuildInfos,
					startTime, endTime);
			deployTimesList.add(deployTimes);
			buildInfosList.add(Map.entry(deploymentEnvironment.getId(), buildKiteBuildInfos));
			leadTimeBuildInfosList.add(Map.entry(deploymentEnvironment.getId(), buildKiteBuildInfos));
		}
		return BuildKiteData.builder()
			.deployTimesList(deployTimesList)
			.buildInfosList(buildInfosList)
			.leadTimeBuildInfosList(leadTimeBuildInfosList)
			.build();
	}

	private void generateCSVForPipeline(GenerateReportRequest request, BuildKiteData buildKiteData) {
		if (request.getBuildKiteSetting() == null) {
			return;
		}

		List<PipelineCSVInfo> leadTimeData = generateCSVForPipelineWithCodebase(request.getCodebaseSetting(),
				request.getStartTime(), request.getEndTime(), buildKiteData);

		List<PipelineCSVInfo> pipelineData = generateCSVForPipelineWithoutCodebase(
				request.getBuildKiteSetting().getDeploymentEnvList(), request.getStartTime(), request.getEndTime(),
				buildKiteData.getBuildInfosList());

		leadTimeData.addAll(pipelineData);
		csvFileGenerator.convertPipelineDataToCSV(leadTimeData, request.getCsvTimeStamp());
	}

	private List<PipelineCSVInfo> generateCSVForPipelineWithoutCodebase(List<DeploymentEnvironment> deploymentEnvList,
			String startTime, String endTime, List<Entry<String, List<BuildKiteBuildInfo>>> buildInfosList) {
		List<PipelineCSVInfo> pipelineCSVInfos = new ArrayList<>();

		for (DeploymentEnvironment deploymentEnvironment : deploymentEnvList) {
			List<BuildKiteBuildInfo> buildInfos = buildInfosList.stream()
				.filter(entry -> entry.getKey().equals(deploymentEnvironment.getId()))
				.findFirst()
				.map(Map.Entry::getValue)
				.orElse(new ArrayList<>());

			List<PipelineCSVInfo> pipelineCSVInfoList = buildInfos.stream().filter(buildInfo -> {
				BuildKiteJob buildKiteJob = buildInfo.getBuildKiteJob(buildInfo.getJobs(),
						deploymentEnvironment.getStep(), REQUIRED_STATES, startTime, endTime);
				return buildKiteJob != null && !buildInfo.getCommit().isEmpty();
			}).map(buildInfo -> {
				DeployInfo deployInfo = buildInfo.mapToDeployInfo(deploymentEnvironment.getStep(), REQUIRED_STATES,
						startTime, endTime);

				LeadTime noMergeDelayTime = getLeadTimeWithoutMergeDelayTime(deployInfo);

				return PipelineCSVInfo.builder()
					.pipeLineName(deploymentEnvironment.getName())
					.stepName(deploymentEnvironment.getStep())
					.buildInfo(buildInfo)
					.deployInfo(deployInfo)
					.leadTimeInfo(new LeadTimeInfo(noMergeDelayTime))
					.build();
			}).toList();

			pipelineCSVInfos.addAll(pipelineCSVInfoList);
		}
		return pipelineCSVInfos;
	}

	private List<PipelineCSVInfo> generateCSVForPipelineWithCodebase(CodebaseSetting codebaseSetting, String startTime,
			String endTime, BuildKiteData buildKiteData) {
		List<PipelineCSVInfo> pipelineCSVInfos = new ArrayList<>();

		if (codebaseSetting == null) {
			return pipelineCSVInfos;
		}

		for (DeploymentEnvironment deploymentEnvironment : codebaseSetting.getLeadTime()) {
			String repoId = GithubUtil
				.getGithubUrlFullName(getRepoMap(codebaseSetting).get(deploymentEnvironment.getId()));
			List<BuildKiteBuildInfo> buildInfos = buildKiteData.getLeadTimeBuildInfosList()
				.stream()
				.filter(entry -> entry.getKey().equals(deploymentEnvironment.getId()))
				.findFirst()
				.map(Map.Entry::getValue)
				.orElse(new ArrayList<>());

			List<PipelineCSVInfo> pipelineCSVInfoList = buildInfos.stream().filter(buildInfo -> {
				BuildKiteJob buildKiteJob = buildInfo.getBuildKiteJob(buildInfo.getJobs(),
						deploymentEnvironment.getStep(), REQUIRED_STATES, startTime, endTime);
				return buildKiteJob != null && !buildInfo.getCommit().isEmpty();
			}).map(buildInfo -> {
				DeployInfo deployInfo = buildInfo.mapToDeployInfo(deploymentEnvironment.getStep(), REQUIRED_STATES,
						startTime, endTime);
				List<PipelineLeadTime> pipelineLeadTimes = buildKiteData.getPipelineLeadTimes();

				LeadTime filteredLeadTime = pipelineLeadTimes.stream()
					.filter(pipelineLeadTime -> Objects.equals(pipelineLeadTime.getPipelineName(),
							deploymentEnvironment.getName()))
					.flatMap(filteredPipeLineLeadTime -> filteredPipeLineLeadTime.getLeadTimes().stream())
					.filter(leadTime -> leadTime.getCommitId().equals(deployInfo.getCommitId()))
					.findFirst()
					.orElse(null);

				CommitInfo commitInfo = gitHubService.fetchCommitInfo(deployInfo.getCommitId(), repoId,
						codebaseSetting.getToken());
				return PipelineCSVInfo.builder()
					.pipeLineName(deploymentEnvironment.getName())
					.stepName(deploymentEnvironment.getStep())
					.buildInfo(buildInfo)
					.deployInfo(deployInfo)
					.commitInfo(commitInfo)
					.leadTimeInfo(new LeadTimeInfo(filteredLeadTime))
					.build();
			}).toList();
			pipelineCSVInfos.addAll(pipelineCSVInfoList);
		}
		return pipelineCSVInfos;
	}

	public InputStreamResource fetchCSVData(ExportCSVRequest request) {
		deleteOldCSV();
		return csvFileGenerator.getDataFromCSV(request.getDataType(), Long.parseLong(request.getCsvTimeStamp()));
	}

	private void deleteOldCSV() {
		File directory = new File("./csv/");
		File[] files = directory.listFiles();
		long currentTimeStamp = System.currentTimeMillis();
		for (File file : files) {
			String fileName = file.getName();
			String[] splitResult = fileName.split("\\s*\\-|\\.\\s*");
			String timeStamp = splitResult[1];
			if (Long.parseLong(timeStamp) < currentTimeStamp - 36000000) {
				file.delete();
			}
		}
	}

	private LeadTime getLeadTimeWithoutMergeDelayTime(DeployInfo deployInfo) {
		long jobFinishTime = Instant.parse(deployInfo.getJobFinishTime()).toEpochMilli();
		long jobStartTime = Instant.parse(deployInfo.getJobStartTime()).toEpochMilli();
		long pipelineCreateTime = Instant.parse(deployInfo.getPipelineCreateTime()).toEpochMilli();

		return LeadTime.builder()
			.commitId(deployInfo.getCommitId())
			.pipelineCreateTime(pipelineCreateTime)
			.jobFinishTime(jobFinishTime)
			.pipelineDelayTime(jobFinishTime - jobStartTime)
			.build();
	}

}
