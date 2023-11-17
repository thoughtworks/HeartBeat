package heartbeat.service.report;

import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.report.dto.response.BoardCSVConfig;
import heartbeat.controller.report.dto.response.PipelineCSVInfo;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.FileIOException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.core.io.InputStreamResource;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertThrows;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CSVFileGeneratorTest {

	@InjectMocks
	CSVFileGenerator csvFileGenerator;

	String mockTimeStamp = "168369327000";

	private static void deleteDirectory(File directory) {
		if (directory.exists()) {
			File[] files = directory.listFiles();
			if (files != null) {
				for (File file : files) {
					if (file.isDirectory()) {
						deleteDirectory(file);
					}
					else {
						file.delete();
					}
				}
			}
			directory.delete();
		}
	}

	@Test
	void shouldConvertPipelineDataToCsv() throws IOException {

		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();
		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);
		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);

		Assertions.assertTrue(file.exists());

		FileInputStream fileInputStream = new FileInputStream(file);
		BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
		String headers = reader.readLine();
		Assertions.assertEquals(
				"\"Pipeline Name\",\"Pipeline Step\",\"Build Number\",\"Committer\",\"First Code Committed Time In PR\",\"Code Committed Time\",\"PR Created Time\",\"PR Merged Time\",\"Deployment Completed Time\",\"Total Lead Time (HH:mm:ss)\",\"PR Lead Time (HH:mm:ss)\",\"Pipeline Lead Time (HH:mm:ss)\",\"Status\",\"Branch\"",
				headers);
		String firstLine = reader.readLine();
		Assertions.assertEquals(
				"\"Heartbeat\",\":rocket: Deploy prod\",\"880\",\"XXXX\",\"2023-05-08T07:18:18Z\",\"2023-05-10T06:43:02.653Z\",\"168369327000\",\"1683793037000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\",\"branch\"",
				firstLine);
		reader.close();
		fileInputStream.close();
		file.delete();
	}

	@Test
	public void shouldMakeCsvDirWhenNotExistGivenDataTypeIsPipeline() {
		String csvDirPath = "./csv";
		File csvDir = new File(csvDirPath);
		deleteDirectory(csvDir);
		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();

		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);

		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);
		Assertions.assertTrue(file.exists());
		file.delete();
	}

	@Test
	public void shouldHasContentWhenGetDataFromCsvGivenDataTypeIsPipeline() throws IOException {
		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();
		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);

		InputStreamResource inputStreamResource = csvFileGenerator.getDataFromCSV("pipeline",
				Long.parseLong(mockTimeStamp));
		InputStream csvDataInputStream = inputStreamResource.getInputStream();
		String csvPipelineData = new BufferedReader(new InputStreamReader(csvDataInputStream)).lines()
			.collect(Collectors.joining("\n"));

		Assertions.assertEquals(
				"\"Pipeline Name\",\"Pipeline Step\",\"Build Number\",\"Committer\",\"First Code Committed Time In PR\",\"Code Committed Time\",\"PR Created Time\",\"PR Merged Time\",\"Deployment Completed Time\",\"Total Lead Time (HH:mm:ss)\",\"PR Lead Time (HH:mm:ss)\",\"Pipeline Lead Time (HH:mm:ss)\",\"Status\",\"Branch\"\n"
						+ "\"Heartbeat\",\":rocket: Deploy prod\",\"880\",\"XXXX\",\"2023-05-08T07:18:18Z\",\"2023-05-10T06:43:02.653Z\",\"168369327000\",\"1683793037000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\",\"branch\"",
				csvPipelineData);

		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);
		file.delete();
	}

	@Test
	public void shouldReturnEmptyWhenDataTypeNotMatch() throws IOException {

		InputStreamResource result = csvFileGenerator.getDataFromCSV("mockDataType", Long.parseLong(mockTimeStamp));
		InputStream csvDataInputStream = result.getInputStream();
		String csvData = new BufferedReader(new InputStreamReader(csvDataInputStream)).lines()
			.collect(Collectors.joining("\n"));

		Assertions.assertEquals("", csvData);
	}

	@Test
	public void shouldThrowExceptionWhenFileNotExist() {
		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();
		assertThrows(FileIOException.class, () -> csvFileGenerator.getDataFromCSV("pipeline", 123456L));
		assertThrows(FileIOException.class,
				() -> csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, "15469:89/033"));
	}

	@Test
	public void shouldMakeCsvDirWhenNotExistGivenDataTypeIsBoard() {
		String csvDirPath = "./csv";
		File csvDir = new File(csvDirPath);
		deleteDirectory(csvDir);
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File csvFile = new File(fileName);
		Assertions.assertTrue(csvFile.exists());
		csvFile.delete();
	}

	@Test
	public void shouldGenerateBoardCsvWhenConvertBoardDataToCsv() {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File csvFile = new File(fileName);
		Assertions.assertTrue(csvFile.exists());
		csvFile.delete();
	}

	@Test
	public void shouldGetValueWhenConvertBoardDataToCsvGivenExtraFields() throws IOException {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO_WITH_BASE_INFO_CUSTOM_DATA();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS_WITH_CUSTOM();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);
		InputStreamResource inputStreamResource = csvFileGenerator.getDataFromCSV("board",
				Long.parseLong(mockTimeStamp));
		InputStream csvDataInputStream = inputStreamResource.getInputStream();
		BufferedReader reader = new BufferedReader(new InputStreamReader(csvDataInputStream));
		String header = reader.readLine();
		String firstRow = reader.readLine();
		String labelName = extraFields.get(0).getLabel();
		String[] headerFields = header.split(",");
		String[] rowFields = firstRow.split(",");
		int index = Arrays.asList(headerFields).indexOf("\"" + labelName + "\"");
		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File csvFile = new File(fileName);
		Assertions.assertEquals("\"dev\"", rowFields[index]);
		csvFile.delete();
	}

	@Test
	public void shouldGenerateBoardCsvWhenConvertBoardDataToCsvGivenBaseInfoIsEmpty() {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO_WITH_EMPTY_BASE_INFO();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File csvFile = new File(fileName);
		Assertions.assertTrue(csvFile.exists());
		csvFile.delete();
	}

	@Test
	public void shouldGenerateBoardCsvWhenConvertBoardDataToCsvGivenBaseInfoFieldsIsNull() {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO_WITH_EMPTY_BASE_INFO_FIELDS();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File csvFile = new File(fileName);
		Assertions.assertTrue(csvFile.exists());
		csvFile.delete();
	}

	@Test
	public void shouldGenerateBoardCsvWhenConvertBoardDataToCsvGivenCycleTimeIsNull() {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO_WITH_EMPTY_CARD_CYCLE_TIME();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File csvFile = new File(fileName);
		Assertions.assertTrue(csvFile.exists());
		csvFile.delete();
	}

	@Test
	public void shouldThrowExceptionWhenBoardCsvNotExist() {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO_WITH_EMPTY_BASE_INFO();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		assertThrows(FileIOException.class, () -> csvFileGenerator.getDataFromCSV("board", 1686710104536L));
		assertThrows(FileIOException.class,
				() -> csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, "15469:89/033"));
	}

	@Test
	public void shouldHasContentWhenGetDataFromCsvGivenDataTypeIsBoard() throws IOException {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);
		InputStreamResource inputStreamResource = csvFileGenerator.getDataFromCSV("board",
				Long.parseLong(mockTimeStamp));
		InputStream csvDataInputStream = inputStreamResource.getInputStream();
		String boardCsvData = new BufferedReader(new InputStreamReader(csvDataInputStream)).lines()
			.collect(Collectors.joining("\n"));

		Assertions.assertEquals(boardCsvData,
				"\"Issue key\",\"Summary\",\"Issue Type\",\"Status\",\"Story Points\",\"assignee\",\"Reporter\",\"Project Key\",\"Project Name\",\"Priority\",\"Parent Summary\",\"Sprint\",\"Labels\",\"Cycle Time\",\"Story point estimate\",\"Flagged\",\"1010\",\"1011\",\"Cycle Time / Story Points\",\"Analysis Days\",\"In Dev Days\",\"Waiting Days\",\"Testing Days\",\"Block Days\",\"Review Days\",\"OriginCycleTime: DOING\",\"OriginCycleTime: BLOCKED\"\n"
						+ "\"ADM-489\",\"summary\",\"issue type\",,\"2\",\"name\",\"name\",\"ADM\",\"Auto Dora Metrics\",\"Medium\",\"parent\",\"sprint 1\",\"\",\"0.90\",\"1.00\",\"\",\"\",\"{}\",\"0.90\",\"0\",\"0.90\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"");

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);
		file.delete();
	}

	@Test
	void shouldConvertMetricDataToCsv() throws IOException {
		ReportResponse reportResponse = MetricCsvFixture.MOCK_METRIC_CSV_DATA();
		csvFileGenerator.convertMetricDataToCSV(reportResponse, mockTimeStamp);
		String fileName = CSVFileNameEnum.METRIC.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);

		Assertions.assertTrue(file.exists());

		FileInputStream fileInputStream = new FileInputStream(file);
		BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
		String headers = reader.readLine();
		Assertions.assertEquals(
			"\"Group\",\"Metrics\",\"Value\"",
			headers);
		String firstLine = reader.readLine();
		Assertions.assertEquals(
			"\"Velocity\",\"Velocity(Story Point)\",\"7\"",
			firstLine);
		reader.close();
		fileInputStream.close();
		file.delete();
	}

	@Test
	public void shouldMakeCsvDirWhenNotExistGivenDataTypeIsMetric() {
		String csvDirPath = "./csv";
		File csvDir = new File(csvDirPath);
		deleteDirectory(csvDir);
		ReportResponse reportResponse = MetricCsvFixture.MOCK_METRIC_CSV_DATA();

		csvFileGenerator.convertMetricDataToCSV(reportResponse, mockTimeStamp);

		String fileName = CSVFileNameEnum.METRIC.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);
		Assertions.assertTrue(file.exists());
		file.delete();
	}

	@Test
	public void shouldThrowExceptionWhenMetricCsvNotExist() {
		assertThrows(FileIOException.class, () -> csvFileGenerator.getDataFromCSV("metric", 1686710104536L));
	}

	@Test
	public void shouldHasContentWhenGetDataFromCsvGivenDataTypeIsMetric() throws IOException {
		ReportResponse reportResponse = MetricCsvFixture.MOCK_METRIC_CSV_DATA();

		csvFileGenerator.convertMetricDataToCSV(reportResponse, mockTimeStamp);
		InputStreamResource inputStreamResource = csvFileGenerator.getDataFromCSV("metric",
			Long.parseLong(mockTimeStamp));
		InputStream csvDataInputStream = inputStreamResource.getInputStream();
		String metricCsvData = new BufferedReader(new InputStreamReader(csvDataInputStream)).lines()
			.collect(Collectors.joining("\n"));

		Assertions.assertEquals(metricCsvData,
			"\"Group\",\"Metrics\",\"Value\"\n" +
				"\"Velocity\",\"Velocity(Story Point)\",\"7\"\n" +
				"\"Velocity\",\"Throughput(Cards Count)\",\"2\"\n" +
				"\"Cycle time\",\"Average cycle time(days/storyPoint)\",\"4.18\"\n" +
				"\"Cycle time\",\"Average cycle time(days/card)\",\"9.75\"\n" +
				"\"Cycle time\",\"Total development time / Total cycle time\",\"62.10\"\n" +
				"\"Cycle time\",\"Total block time / Total cycle time\",\"0.34\"\n" +
				"\"Cycle time\",\"Total review time / Total cycle time\",\"37.39\"\n" +
				"\"Cycle time\",\"Total testing time / Total cycle time\",\"0.17\"\n" +
				"\"Cycle time\",\"Average development time(days/storyPoint)\",\"2.60\"\n" +
				"\"Cycle time\",\"Average development time(days/card)\",\"6.06\"\n" +
				"\"Cycle time\",\"Average block time(days/storyPoint)\",\"0.01\"\n" +
				"\"Cycle time\",\"Average block time(days/card)\",\"0.03\"\n" +
				"\"Cycle time\",\"Average review time(days/storyPoint)\",\"1.56\"\n" +
				"\"Cycle time\",\"Average review time(days/card)\",\"3.65\"\n" +
				"\"Cycle time\",\"Average testing time(days/storyPoint)\",\"0.01\"\n" +
				"\"Cycle time\",\"Average testing time(days/card)\",\"0.02\"\n" +
				"\"Classifications\",\"Issue Type / Bug\",\"33.33\"\n" +
				"\"Classifications\",\"Issue Type / Story\",\"66.67\"\n" +
				"\"Deployment frequency\",\"Heartbeat /  Deploy prod / Deployment frequency(deployments/day)\",\"0.78\"\n" +
				"\"Deployment frequency\",\"Heartbeat /  Check Frontend License / Deployment frequency(deployments/day)\",\"0.56\"\n" +
				"\"Deployment frequency\",\"Average / Deployment frequency(deployments/day)\",\"0.67\"\n" +
				"\"Lead time for changes\",\"Heartbeat /  Deploy prod / PR Lead Time\",\"0\"\n" +
				"\"Lead time for changes\",\"Heartbeat /  Deploy prod / Pipeline Lead Time\",\"0.02\"\n" +
				"\"Lead time for changes\",\"Heartbeat /  Deploy prod / Total Lead Time\",\"0.02\"\n" +
				"\"Lead time for changes\",\"Heartbeat /  Check Frontend License / PR Lead Time\",\"0\"\n" +
				"\"Lead time for changes\",\"Heartbeat /  Check Frontend License / Pipeline Lead Time\",\"0.09\"\n" +
				"\"Lead time for changes\",\"Heartbeat /  Check Frontend License / Total Lead Time\",\"0.09\"\n" +
				"\"Lead time for changes\",\"Average / PR Lead Time\",\"0\"\n" +
				"\"Lead time for changes\",\"Average / Pipeline Lead Time\",\"0.05\"\n" +
				"\"Lead time for changes\",\"Average / Total Lead Time\",\"0.05\"\n" +
				"\"Change failure rate\",\"Heartbeat /  Deploy prod / Failure rate\",\"0\"\n" +
				"\"Change failure rate\",\"Heartbeat /  Check Frontend License / Failure rate\",\"0\"\n" +
				"\"Change failure rate\",\"Average / Failure rate\",\"0\"\n" +
				"\"Mean Time To Recovery\",\"Heartbeat /  Deploy prod / Mean Time To Recovery\",\"0\"\n" +
				"\"Mean Time To Recovery\",\"Heartbeat /  Check Frontend License / Mean Time To Recovery\",\"0\"\n" +
				"\"Mean Time To Recovery\",\"Average / Mean Time To Recovery\",\"0\"");

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);
		file.delete();
	}

}
