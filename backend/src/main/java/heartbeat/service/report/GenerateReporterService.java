package heartbeat.service.report;

import heartbeat.controller.board.dto.request.CardStepsEnum;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.controller.report.dto.response.ErrorInfo;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.controller.report.dto.response.PipelineCSVInfo;
import heartbeat.controller.report.dto.response.ReportMetricsError;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.BadRequestException;
import heartbeat.exception.BaseException;
import heartbeat.exception.GenerateReportException;
import heartbeat.exception.RequestFailedException;
import heartbeat.exception.ServiceUnavailableException;
import heartbeat.handler.AsyncExceptionHandler;
import heartbeat.handler.AsyncMetricsDataHandler;
import heartbeat.handler.AsyncReportRequestHandler;
import heartbeat.handler.base.AsyncExceptionDTO;
import heartbeat.service.report.calculator.ClassificationCalculator;
import heartbeat.service.report.calculator.CycleTimeCalculator;
import heartbeat.service.report.calculator.DeploymentFrequencyCalculator;
import heartbeat.service.report.calculator.DevChangeFailureRateCalculator;
import heartbeat.service.report.calculator.LeadTimeForChangesCalculator;
import heartbeat.service.report.calculator.MeanToRecoveryCalculator;
import heartbeat.service.report.calculator.ReworkCalculator;
import heartbeat.service.report.calculator.VelocityCalculator;
import heartbeat.service.report.calculator.model.FetchedData;
import heartbeat.service.report.calculator.model.FetchedData.BuildKiteData;
import heartbeat.util.IdUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.io.File;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static heartbeat.controller.report.dto.request.MetricType.BOARD;
import static heartbeat.controller.report.dto.request.MetricType.DORA;
import static heartbeat.service.report.scheduler.DeleteExpireCSVScheduler.EXPORT_CSV_VALIDITY_TIME;
import static heartbeat.util.ValueUtil.getValueOrNull;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
@Log4j2
public class GenerateReporterService {

	private final KanbanService kanbanService;

	private final KanbanCsvService kanbanCsvService;

	private final PipelineService pipelineService;

	private final WorkDay workDay;

	private final ClassificationCalculator classificationCalculator;

	private final DeploymentFrequencyCalculator deploymentFrequency;

	private final DevChangeFailureRateCalculator devChangeFailureRate;

	private final MeanToRecoveryCalculator meanToRecoveryCalculator;

	private final CycleTimeCalculator cycleTimeCalculator;

	private final VelocityCalculator velocityCalculator;

	private final CSVFileGenerator csvFileGenerator;

	private final LeadTimeForChangesCalculator leadTimeForChangesCalculator;

	private final ReworkCalculator reworkCalculator;

	private final AsyncReportRequestHandler asyncReportRequestHandler;

	private final AsyncMetricsDataHandler asyncMetricsDataHandler;

	private final AsyncExceptionHandler asyncExceptionHandler;

	private static final char FILENAME_SEPARATOR = '-';

	public void generateBoardReport(GenerateReportRequest request) {
		String boardReportId = request.getBoardReportFileId();
		removePreviousAsyncException(boardReportId);
		log.info(
				"Start to generate board report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _boardReportId: {}",
				request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(), request.getEndTime(),
				boardReportId);
		try {
			saveReporterInHandler(generateBoardReporter(request), boardReportId);
			log.info(
					"Successfully generate board report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _boardReportId: {}",
					request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(), request.getEndTime(),
					boardReportId);
		}
		catch (BaseException e) {
			asyncExceptionHandler.put(boardReportId, e);
			if (List.of(401, 403, 404).contains(e.getStatus()))
				asyncMetricsDataHandler.updateMetricsDataCompletedInHandler(
						IdUtil.getDataCompletedPrefix(request.getBoardReportFileId()), BOARD, false);

		}
	}

	public void generateDoraReport(GenerateReportRequest request) {
		removePreviousAsyncException(request.getPipelineReportFileId());
		removePreviousAsyncException(request.getSourceControlReportFileId());
		FetchedData fetchedData = new FetchedData();
		if (CollectionUtils.isNotEmpty(request.getPipelineMetrics())) {
			GenerateReportRequest pipelineRequest = request.toPipelineRequest();
			generatePipelineReport(pipelineRequest, fetchedData);
		}
		if (CollectionUtils.isNotEmpty(request.getSourceControlMetrics())) {
			GenerateReportRequest sourceControlRequest = request.toSourceControlRequest();
			generateSourceControlReport(sourceControlRequest, fetchedData);
		}

		MetricsDataCompleted previousMetricsCompleted = asyncMetricsDataHandler
			.getMetricsDataCompleted(IdUtil.getDataCompletedPrefix(request.getTimeRangeAndTimeStamp()));
		if (Boolean.FALSE.equals(previousMetricsCompleted.doraMetricsCompleted())) {
			CompletableFuture.runAsync(() -> generateCSVForPipeline(request, fetchedData.getBuildKiteData()));
		}
	}

	private void generatePipelineReport(GenerateReportRequest request, FetchedData fetchedData) {
		String pipelineReportId = request.getPipelineReportFileId();
		log.info(
				"Start to generate pipeline report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _pipelineReportId: {}",
				request.getPipelineMetrics(), request.getConsiderHoliday(), request.getStartTime(),
				request.getEndTime(), pipelineReportId);
		try {
			fetchBuildKiteData(request, fetchedData);
			saveReporterInHandler(generatePipelineReporter(request, fetchedData), pipelineReportId);
			log.info(
					"Successfully generate pipeline report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _pipelineReportId: {}",
					request.getPipelineMetrics(), request.getConsiderHoliday(), request.getStartTime(),
					request.getEndTime(), pipelineReportId);
		}
		catch (BaseException e) {
			asyncExceptionHandler.put(pipelineReportId, e);
			if (List.of(401, 403, 404).contains(e.getStatus()))
				asyncMetricsDataHandler.updateMetricsDataCompletedInHandler(
						IdUtil.getDataCompletedPrefix(request.getTimeRangeAndTimeStamp()), DORA, false);
		}
	}

	private void generateSourceControlReport(GenerateReportRequest request, FetchedData fetchedData) {
		String sourceControlReportId = request.getSourceControlReportFileId();
		log.info(
				"Start to generate source control report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _sourceControlReportId: {}",
				request.getSourceControlMetrics(), request.getConsiderHoliday(), request.getStartTime(),
				request.getEndTime(), sourceControlReportId);
		try {
			fetchGitHubData(request, fetchedData);
			saveReporterInHandler(generateSourceControlReporter(request, fetchedData), sourceControlReportId);
			log.info(
					"Successfully generate source control report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _sourceControlReportId: {}",
					request.getSourceControlMetrics(), request.getConsiderHoliday(), request.getStartTime(),
					request.getEndTime(), sourceControlReportId);
		}
		catch (BaseException e) {
			asyncExceptionHandler.put(sourceControlReportId, e);
			if (List.of(401, 403, 404).contains(e.getStatus()))
				asyncMetricsDataHandler.updateMetricsDataCompletedInHandler(
						IdUtil.getDataCompletedPrefix(request.getTimeRangeAndTimeStamp()), DORA, false);
		}
	}

	private void removePreviousAsyncException(String reportId) {
		asyncExceptionHandler.remove(reportId);
	}

	private synchronized ReportResponse generatePipelineReporter(GenerateReportRequest request,
			FetchedData fetchedData) {
		workDay.changeConsiderHolidayMode(request.getConsiderHoliday());

		ReportResponse reportResponse = new ReportResponse(EXPORT_CSV_VALIDITY_TIME);

		request.getPipelineMetrics().forEach(metric -> {
			switch (metric) {
				case "deployment frequency" -> reportResponse.setDeploymentFrequency(
						deploymentFrequency.calculate(fetchedData.getBuildKiteData().getDeployTimesList(),
								Long.parseLong(request.getStartTime()), Long.parseLong(request.getEndTime())));
				case "dev change failure rate" -> reportResponse.setDevChangeFailureRate(
						devChangeFailureRate.calculate(fetchedData.getBuildKiteData().getDeployTimesList()));
				case "dev mean time to recovery" -> reportResponse.setDevMeanTimeToRecovery(
						meanToRecoveryCalculator.calculate(fetchedData.getBuildKiteData().getDeployTimesList()));
				default -> {
					// TODO
				}
			}
		});

		return reportResponse;
	}

	private synchronized ReportResponse generateBoardReporter(GenerateReportRequest request) {
		workDay.changeConsiderHolidayMode(request.getConsiderHoliday());
		FetchedData fetchedData = fetchJiraBoardData(request, new FetchedData());

		ReportResponse reportResponse = new ReportResponse(EXPORT_CSV_VALIDITY_TIME);
		JiraBoardSetting jiraBoardSetting = request.getJiraBoardSetting();

		request.getBoardMetrics().forEach(metric -> {
			switch (metric) {
				case "velocity" -> assembleVelocity(fetchedData, reportResponse);
				case "cycle time" -> assembleCycleTime(fetchedData, reportResponse, jiraBoardSetting);
				case "classification" -> assembleClassification(fetchedData, reportResponse, jiraBoardSetting);
				case "rework times" -> assembleReworkInfo(request, fetchedData, reportResponse);
				default -> {
					// TODO
				}
			}
		});

		CompletableFuture.runAsync(() -> generateCsvForBoard(request, fetchedData));
		return reportResponse;
	}

	private void generateCsvForBoard(GenerateReportRequest request, FetchedData fetchedData) {
		kanbanCsvService.generateCsvInfo(request, fetchedData.getCardCollectionInfo().getRealDoneCardCollection(),
				fetchedData.getCardCollectionInfo().getNonDoneCardCollection());
		asyncMetricsDataHandler.updateMetricsDataCompletedInHandler(
				IdUtil.getDataCompletedPrefix(request.getTimeRangeAndTimeStamp()), BOARD, true);
	}

	private void assembleVelocity(FetchedData fetchedData, ReportResponse reportResponse) {
		CardCollection cardCollection = fetchedData.getCardCollectionInfo().getRealDoneCardCollection();
		reportResponse.setVelocity(velocityCalculator.calculateVelocity(cardCollection));
	}

	private void assembleCycleTime(FetchedData fetchedData, ReportResponse reportResponse,
			JiraBoardSetting jiraBoardSetting) {
		reportResponse.setCycleTime(cycleTimeCalculator.calculateCycleTime(
				fetchedData.getCardCollectionInfo().getRealDoneCardCollection(), jiraBoardSetting.getBoardColumns()));
	}

	private void assembleClassification(FetchedData fetchedData, ReportResponse reportResponse,
			JiraBoardSetting jiraBoardSetting) {
		reportResponse.setClassificationList(classificationCalculator.calculate(jiraBoardSetting.getTargetFields(),
				fetchedData.getCardCollectionInfo().getRealDoneCardCollection()));
	}

	private void assembleReworkInfo(GenerateReportRequest request, FetchedData fetchedData,
			ReportResponse reportResponse) {
		if (isNull(request.getJiraBoardSetting().getReworkTimesSetting())) {
			return;
		}
		CardCollection realDoneCardCollection = fetchedData.getCardCollectionInfo().getRealDoneCardCollection();
		CardStepsEnum enumReworkState = request.getJiraBoardSetting().getReworkTimesSetting().getEnumReworkState();
		reportResponse.setRework(reworkCalculator.calculateRework(realDoneCardCollection, enumReworkState));
	}

	private synchronized ReportResponse generateSourceControlReporter(GenerateReportRequest request,
			FetchedData fetchedData) {
		workDay.changeConsiderHolidayMode(request.getConsiderHoliday());

		ReportResponse reportResponse = new ReportResponse(EXPORT_CSV_VALIDITY_TIME);

		request.getSourceControlMetrics().forEach(metric -> {
			switch (metric) {
				case "lead time for changes" -> reportResponse.setLeadTimeForChanges(
						leadTimeForChangesCalculator.calculate(fetchedData.getBuildKiteData().getPipelineLeadTimes()));
				default -> {
					// TODO
				}
			}
		});

		return reportResponse;
	}

	private void fetchBuildKiteData(GenerateReportRequest request, FetchedData fetchedData) {
		if (request.getBuildKiteSetting() == null)
			throw new BadRequestException("Failed to fetch BuildKite info due to BuildKite setting is null.");
		fetchedData.setBuildKiteData(pipelineService.fetchBuildKiteInfo(request));
	}

	private void fetchGitHubData(GenerateReportRequest request, FetchedData fetchedData) {
		if (request.getCodebaseSetting() == null)
			throw new BadRequestException("Failed to fetch Github info due to code base setting is null.");
		fetchedData.setBuildKiteData(pipelineService.fetchGitHubData(request));
	}

	private FetchedData fetchJiraBoardData(GenerateReportRequest request, FetchedData fetchedData) {
		if (CollectionUtils.isNotEmpty(request.getBoardMetrics())) {
			if (request.getJiraBoardSetting() == null)
				throw new BadRequestException("Failed to fetch Jira info due to Jira board setting is null.");
			fetchedData.setCardCollectionInfo(kanbanService.fetchDataFromKanban(request));
		}
		return fetchedData;
	}

	private void generateCSVForPipeline(GenerateReportRequest request, BuildKiteData buildKiteData) {
		List<PipelineCSVInfo> pipelineData = pipelineService.generateCSVForPipeline(request.getStartTime(),
				request.getEndTime(), buildKiteData, request.getBuildKiteSetting().getDeploymentEnvList());

		csvFileGenerator.convertPipelineDataToCSV(pipelineData, request.getTimeRangeAndTimeStamp());
		asyncMetricsDataHandler.updateMetricsDataCompletedInHandler(
				IdUtil.getDataCompletedPrefix(request.getTimeRangeAndTimeStamp()), DORA, true);
	}

	public void generateCSVForMetric(ReportResponse reportContent, String csvTimeRangeTimeStamp) {
		csvFileGenerator.convertMetricDataToCSV(reportContent, csvTimeRangeTimeStamp);
	}

	private void saveReporterInHandler(ReportResponse reportContent, String reportId) {
		asyncReportRequestHandler.putReport(reportId, reportContent);
	}

	private ErrorInfo handleAsyncExceptionAndGetErrorInfo(AsyncExceptionDTO exception) {
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
				String[] splitResult = fileName.split("[-.]");
				String timeStamp = splitResult[1];
				if (validateExpire(currentTimeStamp, Long.parseLong(timeStamp)) && !file.delete() && file.exists()) {
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

	private ReportResponse getReportFromHandler(String reportId) {
		return asyncReportRequestHandler.getReport(reportId);
	}

	public MetricsDataCompleted checkReportReadyStatus(String timeRangeAndTimeStamp) {
		String timeStamp = timeRangeAndTimeStamp.substring(timeRangeAndTimeStamp.lastIndexOf(FILENAME_SEPARATOR) + 1);
		if (validateExpire(System.currentTimeMillis(), Long.parseLong(timeStamp))) {
			throw new GenerateReportException("Failed to get report due to report time expires");
		}
		return asyncMetricsDataHandler.getMetricsDataCompleted(IdUtil.getDataCompletedPrefix(timeRangeAndTimeStamp));
	}

	public ReportResponse getComposedReportResponse(String timeStamp, String startTime, String endTime) {
		String timeRangeAndTimeStamp = startTime + FILENAME_SEPARATOR + endTime + FILENAME_SEPARATOR + timeStamp;
		MetricsDataCompleted reportReadyStatus = checkReportReadyStatus(timeRangeAndTimeStamp);

		ReportResponse boardReportResponse = getReportFromHandler(IdUtil.getBoardReportFileId(timeRangeAndTimeStamp));
		ReportResponse pipelineReportResponse = getReportFromHandler(
				IdUtil.getPipelineReportFileId(timeRangeAndTimeStamp));
		ReportResponse sourceControlReportResponse = getReportFromHandler(
				IdUtil.getSourceControlReportFileId(timeRangeAndTimeStamp));

		ReportMetricsError reportMetricsError = getReportErrorAndHandleAsyncException(timeRangeAndTimeStamp);
		return ReportResponse.builder()
			.velocity(getValueOrNull(boardReportResponse, ReportResponse::getVelocity))
			.classificationList(getValueOrNull(boardReportResponse, ReportResponse::getClassificationList))
			.cycleTime(getValueOrNull(boardReportResponse, ReportResponse::getCycleTime))
			.rework(getValueOrNull(boardReportResponse, ReportResponse::getRework))
			.exportValidityTime(EXPORT_CSV_VALIDITY_TIME)
			.deploymentFrequency(getValueOrNull(pipelineReportResponse, ReportResponse::getDeploymentFrequency))
			.devChangeFailureRate(getValueOrNull(pipelineReportResponse, ReportResponse::getDevChangeFailureRate))
			.devMeanTimeToRecovery(getValueOrNull(pipelineReportResponse, ReportResponse::getDevMeanTimeToRecovery))
			.leadTimeForChanges(getValueOrNull(sourceControlReportResponse, ReportResponse::getLeadTimeForChanges))
			.boardMetricsCompleted(reportReadyStatus.boardMetricsCompleted())
			.doraMetricsCompleted(reportReadyStatus.doraMetricsCompleted())
			.overallMetricsCompleted(reportReadyStatus.overallMetricCompleted())
			.allMetricsCompleted(reportReadyStatus.allMetricsCompleted())
			.isSuccessfulCreateCsvFile(reportReadyStatus.isSuccessfulCreateCsvFile())
			.reportMetricsError(reportMetricsError)
			.build();
	}

	private ReportMetricsError getReportErrorAndHandleAsyncException(String reportId) {
		AsyncExceptionDTO boardException = asyncExceptionHandler.get(IdUtil.getBoardReportFileId(reportId));
		AsyncExceptionDTO pipelineException = asyncExceptionHandler.get(IdUtil.getPipelineReportFileId(reportId));
		AsyncExceptionDTO sourceControlException = asyncExceptionHandler
			.get(IdUtil.getSourceControlReportFileId(reportId));
		return ReportMetricsError.builder()
			.boardMetricsError(handleAsyncExceptionAndGetErrorInfo(boardException))
			.pipelineMetricsError(handleAsyncExceptionAndGetErrorInfo(pipelineException))
			.sourceControlMetricsError(handleAsyncExceptionAndGetErrorInfo(sourceControlException))
			.build();
	}

}
