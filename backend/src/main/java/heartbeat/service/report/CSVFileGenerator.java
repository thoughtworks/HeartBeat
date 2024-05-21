package heartbeat.service.report;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.opencsv.CSVWriter;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.report.dto.request.ReportType;
import heartbeat.controller.report.dto.response.AvgDeploymentFrequency;
import heartbeat.controller.report.dto.response.AvgDevChangeFailureRate;
import heartbeat.controller.report.dto.response.AvgDevMeanTimeToRecovery;
import heartbeat.controller.report.dto.response.AvgLeadTimeForChanges;
import heartbeat.controller.report.dto.response.BoardCSVConfig;
import heartbeat.controller.report.dto.response.BoardCSVConfigEnum;
import heartbeat.controller.report.dto.response.Classification;
import heartbeat.controller.report.dto.response.ClassificationNameValuePair;
import heartbeat.controller.report.dto.response.CycleTime;
import heartbeat.controller.report.dto.response.CycleTimeForSelectedStepItem;
import heartbeat.controller.report.dto.response.DeploymentFrequency;
import heartbeat.controller.report.dto.response.DeploymentFrequencyOfPipeline;
import heartbeat.controller.report.dto.response.DevChangeFailureRate;
import heartbeat.controller.report.dto.response.DevChangeFailureRateOfPipeline;
import heartbeat.controller.report.dto.response.DevMeanTimeToRecovery;
import heartbeat.controller.report.dto.response.DevMeanTimeToRecoveryOfPipeline;
import heartbeat.controller.report.dto.response.LeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChangesOfPipelines;
import heartbeat.controller.report.dto.response.LeadTimeInfo;
import heartbeat.controller.report.dto.response.PipelineCSVInfo;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.controller.report.dto.response.Rework;
import heartbeat.controller.report.dto.response.Velocity;
import heartbeat.exception.FileIOException;
import heartbeat.exception.GenerateReportException;
import heartbeat.util.DecimalUtil;
import io.micrometer.core.instrument.util.TimeUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static heartbeat.service.report.calculator.ClassificationCalculator.pickDisplayNameFromObj;
import static heartbeat.util.DecimalUtil.formatDecimalFour;
import static heartbeat.util.TimeUtil.convertToSimpleISOFormat;
import static java.util.Optional.ofNullable;
import static java.util.concurrent.TimeUnit.HOURS;

@RequiredArgsConstructor
@Component
@Log4j2
public class CSVFileGenerator {

	private static final char FILENAME_SEPARATOR = '-';

	private static final String CSV_EXTENSION = ".csv";

	public static final String FILE_LOCAL_PATH = "./app/output/csv";

	private static final Path FILE_PATH = new File(FILE_LOCAL_PATH).toPath().normalize();

	private static final String CANCELED_STATUS = "canceled";

	private static final String REWORK_FIELD = "Rework";

	public static InputStreamResource readStringFromCsvFile(File file) {
		if (!file.toPath().normalize().startsWith(FILE_PATH)) {
			throw new IllegalArgumentException("Invalid file path");
		}
		try {
			InputStream inputStream = new FileInputStream(file);
			return new InputStreamResource(inputStream);
		}
		catch (IOException e) {
			log.error("Failed to read file", e);
			throw new FileIOException(e);
		}
	}

	private static Map<String, JsonElement> getCustomFields(JiraCardDTO perRowCardDTO) {
		if (perRowCardDTO.getBaseInfo() != null && perRowCardDTO.getBaseInfo().getFields() != null) {
			return perRowCardDTO.getBaseInfo().getFields().getCustomFields();
		}
		else {
			return null;
		}
	}

	public void convertPipelineDataToCSV(List<PipelineCSVInfo> leadTimeData, String csvTimeStamp) {
		log.info("Start to create csv directory");
		createCsvDirToConvertData();

		String fileName = CSVFileNameEnum.PIPELINE.getValue() + FILENAME_SEPARATOR + csvTimeStamp + CSV_EXTENSION;
		if (!fileName.contains("..") && fileName.startsWith(FILE_LOCAL_PATH)) {
			File file = new File(fileName);
			try (CSVWriter csvWriter = new CSVWriter(new FileWriter(file))) {
				String[] headers = { "Organization", "Pipeline Name", "Pipeline Step", "Valid", "Build Number",
						"Code Committer", "Build Creator", "First Code Committed Time In PR", "PR Created Time",
						"PR Merged Time", "No PR Committed Time", "Job Start Time", "Pipeline Start Time",
						"Pipeline Finish Time", "Total Lead Time (HH:mm:ss)", "PR Lead Time (HH:mm:ss)",
						"Pipeline Lead Time (HH:mm:ss)", "Status", "Branch", "Revert" };

				csvWriter.writeNext(headers);

				leadTimeData.stream().map(this::getRowData).forEach(csvWriter::writeNext);
			}
			catch (IOException e) {
				log.error("Failed to write pipeline file", e);
				throw new FileIOException(e);
			}
		}
		else {
			throw new GenerateReportException("Failed to generate pipeline csv file, invalid csvTimestamp");
		}
	}

	private String[] getRowData(PipelineCSVInfo csvInfo) {
		String committerName = ofNullable(csvInfo.getBuildInfo().getAuthor())
			.map(BuildKiteBuildInfo.Author::getUsername)
			.orElse(null);

		String creatorName = ofNullable(csvInfo.getBuildInfo().getCreator()).map(BuildKiteBuildInfo.Creator::getName)
			.orElse(null);

		String organization = csvInfo.getOrganizationName();
		String pipelineName = csvInfo.getPipeLineName();
		String stepName = csvInfo.getStepName();
		String valid = String.valueOf(csvInfo.getValid()).toLowerCase();
		String buildNumber = String.valueOf(csvInfo.getBuildInfo().getNumber());

		String state = csvInfo.getPiplineStatus().equals(CANCELED_STATUS) ? CANCELED_STATUS
				: csvInfo.getDeployInfo().getState();
		String branch = csvInfo.getBuildInfo().getBranch();

		LeadTimeInfo leadTimeInfo = csvInfo.getLeadTimeInfo();
		String firstCommitTimeInPr = leadTimeInfo.getFirstCommitTimeInPr();
		String prCreatedTime = leadTimeInfo.getPrCreatedTime();
		String prMergedTime = leadTimeInfo.getPrMergedTime();
		String noPRCommitTime = leadTimeInfo.getNoPRCommitTime();
		String jobStartTime = leadTimeInfo.getJobStartTime();
		String pipelineStartTime = leadTimeInfo.getFirstCommitTime();
		String pipelineFinishTime = csvInfo.getDeployInfo().getJobFinishTime();
		String totalTime = leadTimeInfo.getTotalTime();
		String prLeadTime = leadTimeInfo.getPrLeadTime();
		String pipelineLeadTime = leadTimeInfo.getPipelineLeadTime();
		String isRevert = leadTimeInfo.getIsRevert() == null ? "" : String.valueOf(leadTimeInfo.getIsRevert());

		return new String[] { organization, pipelineName, stepName, valid, buildNumber, committerName, creatorName,
				firstCommitTimeInPr, prCreatedTime, prMergedTime, noPRCommitTime, jobStartTime, pipelineStartTime,
				pipelineFinishTime, totalTime, prLeadTime, pipelineLeadTime, state, branch, isRevert };
	}

	public InputStreamResource getDataFromCSV(ReportType reportDataType, String timeRangeAndTimeStamp) {
		if (timeRangeAndTimeStamp.contains("..") || timeRangeAndTimeStamp.contains("/")
				|| timeRangeAndTimeStamp.contains("\\")) {
			throw new IllegalArgumentException("Invalid time range time stamp");
		}
		return switch (reportDataType) {
			case METRIC -> readStringFromCsvFile(new File(FILE_LOCAL_PATH,
					ReportType.METRIC.getValue() + FILENAME_SEPARATOR + timeRangeAndTimeStamp + CSV_EXTENSION));
			case PIPELINE -> readStringFromCsvFile(new File(FILE_LOCAL_PATH,
					ReportType.PIPELINE.getValue() + FILENAME_SEPARATOR + timeRangeAndTimeStamp + CSV_EXTENSION));
			default -> readStringFromCsvFile(new File(FILE_LOCAL_PATH,
					ReportType.BOARD.getValue() + FILENAME_SEPARATOR + timeRangeAndTimeStamp + CSV_EXTENSION));
		};
	}

	private void createCsvDirToConvertData() {
		String directoryPath = FILE_LOCAL_PATH;
		File directory = new File(directoryPath);
		String message = directory.mkdirs() ? "Successfully create csv directory" : "CSV directory is already exist";
		log.info(message);
	}

	public void convertBoardDataToCSV(List<JiraCardDTO> cardDTOList, List<BoardCSVConfig> fields,
			List<BoardCSVConfig> extraFields, String csvTimeStamp) {
		log.info("Start to create board csv directory");
		String[][] mergedArrays = assembleBoardData(cardDTOList, fields, extraFields);
		writeDataToCSV(csvTimeStamp, mergedArrays);
	}

	public void writeDataToCSV(String csvTimeRangeTimeStamp, String[][] mergedArrays) {
		createCsvDirToConvertData();

		String fileName = CSVFileNameEnum.BOARD.getValue() + FILENAME_SEPARATOR + csvTimeRangeTimeStamp + CSV_EXTENSION;
		if (!fileName.contains("..") && fileName.startsWith(FILE_LOCAL_PATH)) {
			try (CSVWriter writer = new CSVWriter(new FileWriter(fileName))) {
				writer.writeAll(Arrays.asList(mergedArrays));
			}
			catch (IOException e) {
				log.error("Failed to write board file", e);
				throw new FileIOException(e);
			}
		}
		else {
			throw new GenerateReportException("Failed to generate board csv file, invalid csvTimestamp");
		}
	}

	public String[][] assembleBoardData(List<JiraCardDTO> cardDTOList, List<BoardCSVConfig> fields,
			List<BoardCSVConfig> extraFields) {
		List<BoardCSVConfig> fixedFields = new ArrayList<>(fields);
		fixedFields.removeAll(extraFields);

		String[][] fixedFieldsData = getFixedFieldsData(cardDTOList, fixedFields);
		String[][] extraFieldsData = getExtraFieldsData(cardDTOList, extraFields);

		String[] fixedFieldsRow = fixedFieldsData[0];
		String targetElement = "Cycle Time";
		List<String> fixedFieldsRowList = Arrays.asList(fixedFieldsRow);
		int targetIndex = fixedFieldsRowList.indexOf(targetElement) + 1;

		return mergeArrays(fixedFieldsData, extraFieldsData, targetIndex);
	}

	public String[][] mergeArrays(String[][] fixedFieldsData, String[][] extraFieldsData, int fixedColumnCount) {
		int mergedColumnLength = fixedFieldsData[0].length + extraFieldsData[0].length;
		String[][] mergedArray = new String[fixedFieldsData.length][mergedColumnLength];
		for (int i = 0; i < fixedFieldsData.length; i++) {
			String[] mergedPerRowArray = new String[mergedColumnLength];
			System.arraycopy(fixedFieldsData[i], 0, mergedPerRowArray, 0, fixedColumnCount);
			System.arraycopy(extraFieldsData[i], 0, mergedPerRowArray, fixedColumnCount, extraFieldsData[i].length);
			System.arraycopy(fixedFieldsData[i], fixedColumnCount, mergedPerRowArray,
					fixedColumnCount + extraFieldsData[i].length, fixedFieldsData[i].length - fixedColumnCount);
			mergedArray[i] = mergedPerRowArray;
		}

		return mergedArray;
	}

	private String[][] getExtraFieldsData(List<JiraCardDTO> cardDTOList, List<BoardCSVConfig> extraFields) {
		int rowCount = cardDTOList.size() + 1;
		int columnCount = extraFields.size();
		String[][] data = new String[rowCount][columnCount];

		for (int column = 0; column < columnCount; column++) {
			data[0][column] = extraFields.get(column).getLabel();
		}
		for (int row = 0; row < cardDTOList.size(); row++) {
			JiraCardDTO perRowCardDTO = cardDTOList.get(row);
			Map<String, JsonElement> customFields = getCustomFields(perRowCardDTO);
			for (int column = 0; column < columnCount; column++) {
				data[row + 1][column] = getExtraDataPerRow(customFields, extraFields.get(column));
			}
		}
		return data;
	}

	private String[][] getFixedFieldsData(List<JiraCardDTO> cardDTOList, List<BoardCSVConfig> fixedFields) {

		int rowCount = cardDTOList.size() + 1;
		int columnCount = fixedFields.size();
		List<BoardCSVConfig> originCycleTimeFields = getOriginCycleTimeFields(fixedFields);
		int fixedFieldColumnCount = columnCount - originCycleTimeFields.size();

		String[][] data = new String[rowCount][columnCount];

		for (int column = 0; column < columnCount; column++) {
			data[0][column] = fixedFields.get(column).getLabel();
		}
		for (int row = 0; row < cardDTOList.size(); row++) {
			JiraCardDTO cardDTO = cardDTOList.get(row);

			String[] fixedDataPerRow = getFixedDataPerRow(cardDTO, fixedFieldColumnCount);
			String[] originCycleTimePerRow = getOriginCycleTimePerRow(cardDTO, originCycleTimeFields);
			data[row + 1] = Stream.concat(Arrays.stream(fixedDataPerRow), Arrays.stream(originCycleTimePerRow))
				.toArray(String[]::new);
		}
		return data;
	}

	private String[] getOriginCycleTimePerRow(JiraCardDTO cardDTO, List<BoardCSVConfig> originCycleTimeFields) {

		int columnCount = originCycleTimeFields.size();
		String[] data = new String[columnCount];

		for (int column = 0; column < columnCount; column++) {
			data[column] = getExtraDataPerRow(cardDTO.getCycleTimeFlat(), originCycleTimeFields.get(column));
		}
		return data;

	}

	private List<BoardCSVConfig> getOriginCycleTimeFields(List<BoardCSVConfig> fixedFields) {
		BoardCSVConfigEnum[] values = BoardCSVConfigEnum.values();
		List<String> fixedLabels = new ArrayList<>();
		List<BoardCSVConfig> originCycleTimeFields = new ArrayList<>(fixedFields);

		for (BoardCSVConfigEnum value : values) {
			fixedLabels.add(value.getLabel());
		}

		originCycleTimeFields.removeIf(config -> fixedLabels.contains(config.getLabel()));

		return originCycleTimeFields;
	}

	private String[] getFixedDataPerRow(JiraCardDTO cardDTO, int columnCount) {
		String[] rowData = new String[columnCount];
		if (cardDTO.getBaseInfo() != null) {
			rowData[0] = cardDTO.getBaseInfo().getKey();

			if (cardDTO.getBaseInfo().getFields() != null) {
				fixDataWithFields(cardDTO, rowData);
			}

		}
		if (cardDTO.getCardCycleTime() != null) {
			rowData[14] = DecimalUtil.formatDecimalTwo(cardDTO.getCardCycleTime().getTotal());
			rowData[15] = cardDTO.getTotalCycleTimeDivideStoryPoints();
			rowData[16] = DecimalUtil.formatDecimalTwo(cardDTO.getCardCycleTime().getSteps().getAnalyse());
			rowData[17] = DecimalUtil.formatDecimalTwo(cardDTO.getCardCycleTime().getSteps().getDevelopment());
			rowData[18] = DecimalUtil.formatDecimalTwo(cardDTO.getCardCycleTime().getSteps().getWaiting());
			rowData[19] = DecimalUtil.formatDecimalTwo(cardDTO.getCardCycleTime().getSteps().getTesting());
			rowData[20] = DecimalUtil.formatDecimalTwo(cardDTO.getCardCycleTime().getSteps().getBlocked());
			rowData[21] = DecimalUtil.formatDecimalTwo(cardDTO.getCardCycleTime().getSteps().getReview());
		}
		return rowData;
	}

	private void fixDataWithFields(JiraCardDTO cardDTO, String[] rowData) {
		rowData[1] = cardDTO.getBaseInfo().getFields().getSummary();
		rowData[2] = cardDTO.getBaseInfo().getFields().getIssuetype().getName();
		rowData[3] = cardDTO.getBaseInfo().getFields().getStatus().getName();
		if (cardDTO.getBaseInfo().getFields().getLastStatusChangeDate() != null) {
			rowData[4] = convertToSimpleISOFormat(cardDTO.getBaseInfo().getFields().getLastStatusChangeDate());
		}
		rowData[5] = String.valueOf(cardDTO.getBaseInfo().getFields().getStoryPoints());
		if (cardDTO.getBaseInfo().getFields().getAssignee() != null) {
			rowData[6] = cardDTO.getBaseInfo().getFields().getAssignee().getDisplayName();
		}
		if (cardDTO.getBaseInfo().getFields().getReporter() != null) {
			rowData[7] = cardDTO.getBaseInfo().getFields().getReporter().getDisplayName();
		}

		rowData[8] = cardDTO.getBaseInfo().getFields().getProject().getKey();
		rowData[9] = cardDTO.getBaseInfo().getFields().getProject().getName();
		rowData[10] = cardDTO.getBaseInfo().getFields().getPriority().getName();

		if (cardDTO.getBaseInfo().getFields().getParent() != null) {
			rowData[11] = cardDTO.getBaseInfo().getFields().getParent().getFields().getSummary();
		}

		if (cardDTO.getBaseInfo().getFields().getSprint() != null) {
			rowData[12] = cardDTO.getBaseInfo().getFields().getSprint().getName();
		}

		rowData[13] = String.join(",", cardDTO.getBaseInfo().getFields().getLabels());
	}

	public String getExtraDataPerRow(Object object, BoardCSVConfig extraField) {
		Map<String, JsonElement> elementMap = (Map<String, JsonElement>) object;
		if (elementMap == null) {
			return null;
		}
		String[] values = extraField.getValue().split("\\.");
		String extraFieldValue = values[values.length - 1];
		Object fieldValue = elementMap.get(extraFieldValue);

		if (fieldValue == null) {
			if (extraField.getLabel().contains("OriginCycleTime")) {
				return "0";
			}
			return "";
		}
		else if (fieldValue instanceof Double) {
			return DecimalUtil.formatDecimalTwo((Double) fieldValue);
		}
		else if (fieldValue.toString().equals("null")) {
			return "";
		}
		else if (fieldValue instanceof JsonArray objectArray) {
			List<String> objectList = new ArrayList<>();
			for (JsonElement element : objectArray) {
				if (element.isJsonObject()) {
					objectList.add(pickDisplayNameFromObj(element.getAsJsonObject()));
				}
			}
			return StringUtils.join(objectList, ",");
		}
		return pickDisplayNameFromObj(fieldValue);
	}

	public void convertMetricDataToCSV(ReportResponse reportResponse, String csvTimeStamp) {
		log.info("Start to create csv directory");
		createCsvDirToConvertData();

		String fileName = CSVFileNameEnum.METRIC.getValue() + FILENAME_SEPARATOR + csvTimeStamp + CSV_EXTENSION;
		if (!fileName.contains("..") && fileName.startsWith(FILE_LOCAL_PATH)) {
			File file = new File(fileName);

			try (CSVWriter csvWriter = new CSVWriter(new FileWriter(file))) {
				String[] headers = { "Group", "Metrics", "Value" };

				csvWriter.writeNext(headers);

				csvWriter.writeAll(convertReportResponseToCSVRows(reportResponse));
			}
			catch (IOException e) {
				log.error("Failed to write metric file", e);
				throw new FileIOException(e);
			}
		}
		else {
			throw new GenerateReportException("Failed to generate metric csv file, invalid csvTimestamp");
		}
	}

	private List<String[]> convertReportResponseToCSVRows(ReportResponse reportResponse) {
		List<String[]> rows = new ArrayList<>();

		Velocity velocity = reportResponse.getVelocity();
		if (velocity != null)
			rows.addAll(getRowsFormVelocity(velocity));

		CycleTime cycleTime = reportResponse.getCycleTime();
		if (cycleTime != null)
			rows.addAll(getRowsFromCycleTime(cycleTime));

		List<Classification> classificationList = reportResponse.getClassificationList();
		if (classificationList != null)
			classificationList.forEach(classification -> rows.addAll(getRowsFormClassification(classification)));

		Rework rework = reportResponse.getRework();
		if (rework != null) {
			rows.addAll(getRowFromRework(rework));
		}

		DeploymentFrequency deploymentFrequency = reportResponse.getDeploymentFrequency();
		if (deploymentFrequency != null)
			rows.addAll(getRowsFromDeploymentFrequency(deploymentFrequency));

		LeadTimeForChanges leadTimeForChanges = reportResponse.getLeadTimeForChanges();
		if (leadTimeForChanges != null)
			rows.addAll(getRowsFromLeadTimeForChanges(leadTimeForChanges));

		DevChangeFailureRate devChangeFailureRate = reportResponse.getDevChangeFailureRate();
		if (devChangeFailureRate != null)
			rows.addAll(getRowsFromDevChangeFailureRate(devChangeFailureRate));

		DevMeanTimeToRecovery devMeanTimeToRecovery = reportResponse.getDevMeanTimeToRecovery();
		if (devMeanTimeToRecovery != null)
			rows.addAll(getRowsFromDevMeanTimeToRecovery(devMeanTimeToRecovery));

		return rows;
	}

	private List<String[]> getRowsFormVelocity(Velocity velocity) {
		List<String[]> rows = new ArrayList<>();
		rows.add(new String[] { "Velocity", "Velocity(Story Point)", String.valueOf(velocity.getVelocityForSP()) });
		rows.add(
				new String[] { "Velocity", "Throughput(Cards Count)", String.valueOf(velocity.getVelocityForCards()) });
		return rows;
	}

	private List<String[]> getRowsFromCycleTime(CycleTime cycleTime) {
		String cycleTimeTitle = "Cycle time";
		List<String[]> rows = new ArrayList<>();
		List<String[]> rowsForSelectedStepItemAverageTime = new ArrayList<>();
		rows.add(new String[] { cycleTimeTitle, "Average cycle time(days/storyPoint)",
				String.valueOf(cycleTime.getAverageCycleTimePerSP()) });
		rows.add(new String[] { cycleTimeTitle, "Average cycle time(days/card)",
				String.valueOf(cycleTime.getAverageCycleTimePerCard()) });
		List<CycleTimeForSelectedStepItem> swimlaneList = cycleTime.getSwimlaneList();

		swimlaneList.forEach(cycleTimeForSelectedStepItem -> {
			String stepName = formatStepName(cycleTimeForSelectedStepItem);
			double proportion = cycleTimeForSelectedStepItem.getTotalTime() / cycleTime.getTotalTimeForCards();
			rows.add(new String[] { cycleTimeTitle, "Total " + stepName + " time / Total cycle time",
					DecimalUtil.formatDecimalTwo(proportion * 100) });
			rowsForSelectedStepItemAverageTime
				.add(new String[] { cycleTimeTitle, "Average " + stepName + " time(days/storyPoint)",
						DecimalUtil.formatDecimalTwo(cycleTimeForSelectedStepItem.getAverageTimeForSP()) });
			rowsForSelectedStepItemAverageTime
				.add(new String[] { cycleTimeTitle, "Average " + stepName + " time(days/card)",
						DecimalUtil.formatDecimalTwo(cycleTimeForSelectedStepItem.getAverageTimeForCards()) });
		});
		rows.addAll(rowsForSelectedStepItemAverageTime);

		return rows;
	}

	private List<String[]> getRowFromRework(Rework rework) {
		List<String[]> rows = new ArrayList<>();
		rows.add(new String[] { REWORK_FIELD, "Total rework times", String.valueOf(rework.getTotalReworkTimes()) });
		rows.add(new String[] { REWORK_FIELD, "Total rework cards", String.valueOf(rework.getTotalReworkCards()) });
		rows.add(new String[] { REWORK_FIELD, "Rework cards ratio(Total rework cards/Throughput)",
				formatDecimalFour(rework.getReworkCardsRatio()) });
		return rows;
	}

	private String formatStepName(CycleTimeForSelectedStepItem cycleTimeForSelectedStepItem) {
		return switch (cycleTimeForSelectedStepItem.getOptionalItemName()) {
			case "In Dev" -> "development";
			case "Block" -> "block";
			case "Review" -> "review";
			case "Testing" -> "testing";
			default -> "";
		};
	}

	private List<String[]> getRowsFormClassification(Classification classificationList) {
		List<String[]> rows = new ArrayList<>();
		String fieldName = String.valueOf((classificationList.getFieldName()));
		List<ClassificationNameValuePair> pairList = classificationList.getPairList();
		pairList.forEach(
				nameValuePair -> rows.add(new String[] { "Classifications", fieldName + " / " + nameValuePair.getName(),
						DecimalUtil.formatDecimalTwo(nameValuePair.getValue() * 100) }));
		return rows;
	}

	private List<String[]> getRowsFromDeploymentFrequency(DeploymentFrequency deploymentFrequency) {
		List<String[]> rows = new ArrayList<>();
		List<DeploymentFrequencyOfPipeline> deploymentFrequencyOfPipelines = deploymentFrequency
			.getDeploymentFrequencyOfPipelines();
		deploymentFrequencyOfPipelines.forEach(pipeline -> rows.add(new String[] { "Deployment frequency",
				pipeline.getName() + " / " + extractPipelineStep(pipeline.getStep())
						+ " / Deployment frequency(Deployments/Day)",
				DecimalUtil.formatDecimalTwo(pipeline.getDeploymentFrequency()) }));

		AvgDeploymentFrequency avgDeploymentFrequency = deploymentFrequency.getAvgDeploymentFrequency();
		if (deploymentFrequencyOfPipelines.size() > 1)
			rows.add(new String[] { "Deployment frequency",
					avgDeploymentFrequency.getName() + " / Deployment frequency(Deployments/Day)",
					DecimalUtil.formatDecimalTwo(avgDeploymentFrequency.getDeploymentFrequency()) });

		return rows;
	}

	private String extractPipelineStep(String step) {
		return step.replaceAll(":\\w+: ", "");
	}

	private List<String[]> getRowsFromLeadTimeForChanges(LeadTimeForChanges leadTimeForChanges) {
		List<String[]> rows = new ArrayList<>();

		List<LeadTimeForChangesOfPipelines> leadTimeForChangesOfPipelines = leadTimeForChanges
			.getLeadTimeForChangesOfPipelines();
		String leadTimeForChangesTitle = "Lead time for changes";
		leadTimeForChangesOfPipelines.forEach(pipeline -> {
			String pipelineStep = extractPipelineStep(pipeline.getStep());
			rows.add(new String[] { leadTimeForChangesTitle,
					pipeline.getName() + " / " + pipelineStep + " / PR Lead Time",
					DecimalUtil.formatDecimalTwo(TimeUtils.minutesToUnit(pipeline.getPrLeadTime(), HOURS)) });
			rows.add(new String[] { leadTimeForChangesTitle,
					pipeline.getName() + " / " + pipelineStep + " / Pipeline Lead Time",
					DecimalUtil.formatDecimalTwo(TimeUtils.minutesToUnit(pipeline.getPipelineLeadTime(), HOURS)) });
			rows.add(new String[] { leadTimeForChangesTitle,
					pipeline.getName() + " / " + pipelineStep + " / Total Lead Time",
					DecimalUtil.formatDecimalTwo(TimeUtils.minutesToUnit(pipeline.getTotalDelayTime(), HOURS)) });
		});

		AvgLeadTimeForChanges avgLeadTimeForChanges = leadTimeForChanges.getAvgLeadTimeForChanges();
		if (leadTimeForChangesOfPipelines.size() > 1) {
			rows.add(new String[] { leadTimeForChangesTitle, avgLeadTimeForChanges.getName() + " / PR Lead Time",
					DecimalUtil
						.formatDecimalTwo(TimeUtils.minutesToUnit(avgLeadTimeForChanges.getPrLeadTime(), HOURS)) });
			rows.add(new String[] { leadTimeForChangesTitle, avgLeadTimeForChanges.getName() + " / Pipeline Lead Time",
					DecimalUtil.formatDecimalTwo(
							TimeUtils.minutesToUnit(avgLeadTimeForChanges.getPipelineLeadTime(), HOURS)) });
			rows.add(new String[] { leadTimeForChangesTitle, avgLeadTimeForChanges.getName() + " / Total Lead Time",
					DecimalUtil
						.formatDecimalTwo(TimeUtils.minutesToUnit(avgLeadTimeForChanges.getTotalDelayTime(), HOURS)) });
		}

		return rows;
	}

	private List<String[]> getRowsFromDevChangeFailureRate(DevChangeFailureRate devChangeFailureRate) {
		List<String[]> rows = new ArrayList<>();
		List<DevChangeFailureRateOfPipeline> devChangeFailureRateOfPipelines = devChangeFailureRate
			.getDevChangeFailureRateOfPipelines();
		devChangeFailureRateOfPipelines.forEach(pipeline -> rows.add(new String[] { "Dev change failure rate",
				pipeline.getName() + " / " + extractPipelineStep(pipeline.getStep()) + " / Dev change failure rate",
				DecimalUtil.formatDecimalFour(pipeline.getFailureRate()) }));

		AvgDevChangeFailureRate avgDevChangeFailureRate = devChangeFailureRate.getAvgDevChangeFailureRate();
		if (devChangeFailureRateOfPipelines.size() > 1)
			rows.add(new String[] { "Dev change failure rate",
					avgDevChangeFailureRate.getName() + " / Dev change failure rate",
					DecimalUtil.formatDecimalTwo(avgDevChangeFailureRate.getFailureRate() * 100) });

		return rows;
	}

	private List<String[]> getRowsFromDevMeanTimeToRecovery(DevMeanTimeToRecovery devMeanTimeToRecovery) {
		List<String[]> rows = new ArrayList<>();
		List<DevMeanTimeToRecoveryOfPipeline> devMeanTimeToRecoveryOfPipelines = devMeanTimeToRecovery
			.getDevMeanTimeToRecoveryOfPipelines();
		devMeanTimeToRecoveryOfPipelines.forEach(pipeline -> rows.add(new String[] { "Dev mean time to recovery",
				pipeline.getName() + " / " + extractPipelineStep(pipeline.getStep()) + " / Dev mean time to recovery",
				DecimalUtil
					.formatDecimalTwo(TimeUtils.millisToUnit(pipeline.getTimeToRecovery().doubleValue(), HOURS)) }));

		AvgDevMeanTimeToRecovery avgDevMeanTimeToRecovery = devMeanTimeToRecovery.getAvgDevMeanTimeToRecovery();
		if (devMeanTimeToRecoveryOfPipelines.size() > 1)
			rows.add(new String[] { "Dev mean time to recovery",
					avgDevMeanTimeToRecovery.getName() + " / Dev mean time to recovery",
					DecimalUtil.formatDecimalTwo(TimeUtils
						.millisToUnit(avgDevMeanTimeToRecovery.getTimeToRecovery().doubleValue(), HOURS)) });

		return rows;
	}

}
