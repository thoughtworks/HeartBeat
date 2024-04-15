package heartbeat.service.report;

import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.report.dto.request.ReportType;
import heartbeat.controller.report.dto.response.BoardCSVConfig;
import heartbeat.controller.report.dto.response.PipelineCSVInfo;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.FileIOException;
import heartbeat.exception.GenerateReportException;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
	void shouldConvertPipelineDataToCsvGivenCommitInfoNotNull() throws IOException {

		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();
		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);
		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);

		assertTrue(file.exists());

		FileInputStream fileInputStream = new FileInputStream(file);
		BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
		String headers = reader.readLine();
		assertEquals(
				"\"Organization\",\"Pipeline Name\",\"Pipeline Step\",\"Valid\",\"Build Number\",\"Code Committer\",\"Build Creator\",\"First Code Committed Time In PR\",\"PR Created Time\",\"PR Merged Time\",\"No PR Committed Time\",\"Job Start Time\",\"Pipeline Start Time\",\"Pipeline Finish Time\",\"Total Lead Time (HH:mm:ss)\",\"PR Lead Time (HH:mm:ss)\",\"Pipeline Lead Time (HH:mm:ss)\",\"Status\",\"Branch\",\"Revert\"",
				headers);
		String firstLine = reader.readLine();
		assertEquals(
				"\"Thoughtworks-Heartbeat\",\"Heartbeat\",\":rocket: Deploy prod\",\"true\",\"880\",\"XXXX\",,\"2023-05-08T07:18:18Z\",\"168369327000\",\"1683793037000\",,\"168369327000\",\"168369327000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\",\"branch\",\"\"",
				firstLine);
		reader.close();
		fileInputStream.close();
		file.delete();
	}

	@Test
	void shouldConvertPipelineDataToCsvGivenCommitInfoNotNullAndPipelineStateIsCanceled() throws IOException {

		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture
			.MOCK_PIPELINE_CSV_DATA_WITH_PIPELINE_STATUS_IS_CANCELED();

		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);

		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);
		assertTrue(file.exists());
		FileInputStream fileInputStream = new FileInputStream(file);
		BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
		String headers = reader.readLine();
		assertEquals(
				"\"Organization\",\"Pipeline Name\",\"Pipeline Step\",\"Valid\",\"Build Number\",\"Code Committer\",\"Build Creator\",\"First Code Committed Time In PR\",\"PR Created Time\",\"PR Merged Time\",\"No PR Committed Time\",\"Job Start Time\",\"Pipeline Start Time\",\"Pipeline Finish Time\",\"Total Lead Time (HH:mm:ss)\",\"PR Lead Time (HH:mm:ss)\",\"Pipeline Lead Time (HH:mm:ss)\",\"Status\",\"Branch\",\"Revert\"",
				headers);
		String firstLine = reader.readLine();
		assertEquals(
				"\"Thoughtworks-Heartbeat\",\"Heartbeat\",\":rocket: Deploy prod\",\"true\",\"880\",\"XXXX\",,\"2023-05-08T07:18:18Z\",\"168369327000\",\"1683793037000\",,\"168369327000\",\"168369327000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"canceled\",\"branch\",\"\"",
				firstLine);
		reader.close();
		fileInputStream.close();
		file.delete();
	}

	@Test
	void shouldConvertPipelineDataToCsvWithoutCreator() throws IOException {
		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA_WITHOUT_CREATOR();
		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);

		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);
		FileInputStream fileInputStream = new FileInputStream(file);
		BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
		String headers = reader.readLine();
		String firstLine = reader.readLine();

		assertTrue(file.exists());
		assertEquals(
				"\"Organization\",\"Pipeline Name\",\"Pipeline Step\",\"Valid\",\"Build Number\",\"Code Committer\",\"Build Creator\",\"First Code Committed Time In PR\",\"PR Created Time\",\"PR Merged Time\",\"No PR Committed Time\",\"Job Start Time\",\"Pipeline Start Time\",\"Pipeline Finish Time\",\"Total Lead Time (HH:mm:ss)\",\"PR Lead Time (HH:mm:ss)\",\"Pipeline Lead Time (HH:mm:ss)\",\"Status\",\"Branch\",\"Revert\"",
				headers);
		assertEquals(
				"\"Thoughtworks-Heartbeat\",\"Heartbeat\",\":rocket: Deploy prod\",\"null\",\"880\",\"XXXX\",,\"2023-05-08T07:18:18Z\",\"168369327000\",\"1683793037000\",,\"1683793037000\",\"168369327000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\",\"branch\",\"\"",
				firstLine);
		reader.close();
		fileInputStream.close();
		file.delete();
	}

	@Test
	void shouldConvertPipelineDataToCsvWithoutCreatorName() throws IOException {
		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA_WITHOUT_CREATOR_NAME();
		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);

		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);
		FileInputStream fileInputStream = new FileInputStream(file);
		BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
		String headers = reader.readLine();
		String firstLine = reader.readLine();

		assertTrue(file.exists());
		assertEquals(
				"\"Organization\",\"Pipeline Name\",\"Pipeline Step\",\"Valid\",\"Build Number\",\"Code Committer\",\"Build Creator\",\"First Code Committed Time In PR\",\"PR Created Time\",\"PR Merged Time\",\"No PR Committed Time\",\"Job Start Time\",\"Pipeline Start Time\",\"Pipeline Finish Time\",\"Total Lead Time (HH:mm:ss)\",\"PR Lead Time (HH:mm:ss)\",\"Pipeline Lead Time (HH:mm:ss)\",\"Status\",\"Branch\",\"Revert\"",
				headers);
		assertEquals(
				"\"Thoughtworks-Heartbeat\",\"Heartbeat\",\":rocket: Deploy prod\",\"null\",\"880\",,,\"2023-05-08T07:18:18Z\",\"168369327000\",\"1683793037000\",,\"168369327000\",\"168369327000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\",\"branch\",\"\"",
				firstLine);
		reader.close();
		fileInputStream.close();
		file.delete();
	}

	@Test
	void shouldConvertPipelineDataToCsvGivenNullCommitInfo() throws IOException {

		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA_WITH_NULL_COMMIT_INFO();
		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);
		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);

		assertTrue(file.exists());

		FileInputStream fileInputStream = new FileInputStream(file);
		BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
		String headers = reader.readLine();
		assertEquals(
				"\"Organization\",\"Pipeline Name\",\"Pipeline Step\",\"Valid\",\"Build Number\",\"Code Committer\",\"Build Creator\",\"First Code Committed Time In PR\",\"PR Created Time\",\"PR Merged Time\",\"No PR Committed Time\",\"Job Start Time\",\"Pipeline Start Time\",\"Pipeline Finish Time\",\"Total Lead Time (HH:mm:ss)\",\"PR Lead Time (HH:mm:ss)\",\"Pipeline Lead Time (HH:mm:ss)\",\"Status\",\"Branch\",\"Revert\"",
				headers);
		String firstLine = reader.readLine();
		assertEquals(
				"\"Thoughtworks-Heartbeat\",\"Heartbeat\",\":rocket: Deploy prod\",\"true\",\"880\",\"XXXX\",,\"2023-05-08T07:18:18Z\",\"168369327000\",\"1683793037000\",,\"168369327000\",\"168369327000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\",\"branch\",\"\"",
				firstLine);
		reader.close();
		fileInputStream.close();
		file.delete();
	}

	@Test
	void shouldConvertPipelineDataToCsvGivenCommitMessageIsRevert() throws IOException {
		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA_WITH_MESSAGE_IS_REVERT();
		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);

		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);
		FileInputStream fileInputStream = new FileInputStream(file);
		BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
		String headers = reader.readLine();
		String firstLine = reader.readLine();

		assertTrue(file.exists());
		assertEquals(
				"\"Organization\",\"Pipeline Name\",\"Pipeline Step\",\"Valid\",\"Build Number\",\"Code Committer\",\"Build Creator\",\"First Code Committed Time In PR\",\"PR Created Time\",\"PR Merged Time\",\"No PR Committed Time\",\"Job Start Time\",\"Pipeline Start Time\",\"Pipeline Finish Time\",\"Total Lead Time (HH:mm:ss)\",\"PR Lead Time (HH:mm:ss)\",\"Pipeline Lead Time (HH:mm:ss)\",\"Status\",\"Branch\",\"Revert\"",
				headers);
		assertEquals(
				"\"Thoughtworks-Heartbeat\",\"Heartbeat\",\":rocket: Deploy prod\",\"null\",\"880\",\"XXXX\",,\"2023-05-08T07:18:18Z\",\"168369327000\",\"1683793037000\",,\"168369327000\",\"168369327000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\",\"branch\",\"true\"",
				firstLine);
		reader.close();
		fileInputStream.close();
		file.delete();
	}

	@Test
	void shouldConvertPipelineDataToCsvGivenAuthorIsNull() throws IOException {
		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA_WITHOUT_Author_NAME();
		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);

		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);
		FileInputStream fileInputStream = new FileInputStream(file);
		BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
		String headers = reader.readLine();
		String firstLine = reader.readLine();

		assertTrue(file.exists());
		assertEquals(
				"\"Organization\",\"Pipeline Name\",\"Pipeline Step\",\"Valid\",\"Build Number\",\"Code Committer\",\"Build Creator\",\"First Code Committed Time In PR\",\"PR Created Time\",\"PR Merged Time\",\"No PR Committed Time\",\"Job Start Time\",\"Pipeline Start Time\",\"Pipeline Finish Time\",\"Total Lead Time (HH:mm:ss)\",\"PR Lead Time (HH:mm:ss)\",\"Pipeline Lead Time (HH:mm:ss)\",\"Status\",\"Branch\",\"Revert\"",
				headers);
		assertEquals(
				"\"Thoughtworks-Heartbeat\",\"Heartbeat\",\":rocket: Deploy prod\",\"null\",\"880\",,\"XXX\",\"2023-05-08T07:18:18Z\",\"168369327000\",\"1683793037000\",,\"168369327000\",\"168369327000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\",\"branch\",\"\"",
				firstLine);
		reader.close();
		fileInputStream.close();
		file.delete();
	}

	@Test
	void shouldMakeCsvDirWhenNotExistGivenDataTypeIsPipeline() {
		String csvDirPath = "./csv";
		File csvDir = new File(csvDirPath);
		deleteDirectory(csvDir);
		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();

		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);

		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);
		assertTrue(file.exists());
		file.delete();
	}

	@Test
	void shouldHasContentWhenGetDataFromCsvGivenDataTypeIsPipeline() throws IOException {
		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();
		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);

		InputStreamResource inputStreamResource = csvFileGenerator.getDataFromCSV(ReportType.PIPELINE,
				Long.parseLong(mockTimeStamp));
		InputStream csvDataInputStream = inputStreamResource.getInputStream();
		String csvPipelineData = new BufferedReader(new InputStreamReader(csvDataInputStream)).lines()
			.collect(Collectors.joining("\n"));

		Assertions.assertEquals(
				"\"Organization\",\"Pipeline Name\",\"Pipeline Step\",\"Valid\",\"Build Number\",\"Code Committer\",\"Build Creator\",\"First Code Committed Time In PR\",\"PR Created Time\",\"PR Merged Time\",\"No PR Committed Time\",\"Job Start Time\",\"Pipeline Start Time\",\"Pipeline Finish Time\",\"Total Lead Time (HH:mm:ss)\",\"PR Lead Time (HH:mm:ss)\",\"Pipeline Lead Time (HH:mm:ss)\",\"Status\",\"Branch\",\"Revert\"\n"
						+ "\"Thoughtworks-Heartbeat\",\"Heartbeat\",\":rocket: Deploy prod\",\"true\",\"880\",\"XXXX\",,\"2023-05-08T07:18:18Z\",\"168369327000\",\"1683793037000\",,\"168369327000\",\"168369327000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\",\"branch\",\"\"",
				csvPipelineData);

		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);
		file.delete();
	}

	@Test
	void shouldConvertPipelineDataToCsvGivenTwoOrganizationsPipeline() throws IOException {

		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_TWO_ORGANIZATIONS_PIPELINE_CSV_DATA();

		csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, mockTimeStamp);

		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);
		assertTrue(file.exists());

		FileInputStream fileInputStream = new FileInputStream(file);
		BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
		String headers = reader.readLine();
		assertEquals(
				"\"Organization\",\"Pipeline Name\",\"Pipeline Step\",\"Valid\",\"Build Number\",\"Code Committer\",\"Build Creator\",\"First Code Committed Time In PR\",\"PR Created Time\",\"PR Merged Time\",\"No PR Committed Time\",\"Job Start Time\",\"Pipeline Start Time\",\"Pipeline Finish Time\",\"Total Lead Time (HH:mm:ss)\",\"PR Lead Time (HH:mm:ss)\",\"Pipeline Lead Time (HH:mm:ss)\",\"Status\",\"Branch\",\"Revert\"",
				headers);

		String firstLine = reader.readLine();
		assertEquals(
				"\"Thoughtworks-Heartbeat\",\"Heartbeat\",\":rocket: Deploy prod\",\"true\",\"880\",,\"XXXX\",\"2023-05-08T07:18:18Z\",\"168369327000\",\"1683793037000\",,\"168369327000\",\"168369327000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\",\"branch\",\"\"",
				firstLine);

		String secondLine = reader.readLine();
		assertEquals(
				"\"Thoughtworks-Heartbeat\",\"Heartbeat\",\":rocket: Deploy prod\",\"true\",\"880\",\"XXXX\",,\"2023-05-08T07:18:18Z\",\"168369327000\",\"1683793037000\",,\"168369327000\",\"168369327000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\",\"branch\",\"\"",
				secondLine);

		String thirdLine = reader.readLine();
		assertEquals(
				"\"Thoughtworks-Foxtel\",\"Heartbeat1\",\":rocket: Deploy prod\",\"true\",\"880\",,\"XXXX\",\"2023-05-08T07:18:18Z\",\"168369327000\",\"1683793037000\",,\"168369327000\",\"168369327000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\",\"branch\",\"\"",
				thirdLine);

		reader.close();
		fileInputStream.close();
		file.delete();
	}

	@Test
	void shouldThrowExceptionWhenFileNotExist() {
		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();
		assertThrows(FileIOException.class, () -> csvFileGenerator.getDataFromCSV(ReportType.PIPELINE, 123456L));
		assertThrows(FileIOException.class,
				() -> csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, "15469:89/033"));
	}

	@Test
	void shouldMakeCsvDirWhenNotExistGivenDataTypeIsBoard() {
		String csvDirPath = "./app/output/csv";
		File csvDir = new File(csvDirPath);
		deleteDirectory(csvDir);
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File csvFile = new File(fileName);
		assertTrue(csvFile.exists());
		csvFile.delete();
	}

	@Test
	void shouldGenerateBoardCsvWhenConvertBoardDataToCsv() {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File csvFile = new File(fileName);
		assertTrue(csvFile.exists());
		csvFile.delete();
	}

	@Test
	void shouldGetValueWhenConvertBoardDataToCsvGivenExtraFields() throws IOException {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO_WITH_BASE_INFO_CUSTOM_DATA();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS_WITH_CUSTOM();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);
		InputStreamResource inputStreamResource = csvFileGenerator.getDataFromCSV(ReportType.BOARD,
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
	void shouldGenerateBoardCsvWhenConvertBoardDataToCsvGivenBaseInfoIsEmpty() {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO_WITH_EMPTY_BASE_INFO();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File csvFile = new File(fileName);
		assertTrue(csvFile.exists());
		csvFile.delete();
	}

	@Test
	void shouldGenerateBoardCsvWhenConvertBoardDataToCsvGivenBaseInfoFieldsIsNull() {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO_WITH_EMPTY_BASE_INFO_FIELDS();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File csvFile = new File(fileName);
		assertTrue(csvFile.exists());
		csvFile.delete();
	}

	@Test
	void shouldGenerateBoardCsvWhenConvertBoardDataToCsvGivenCycleTimeIsNull() {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO_WITH_EMPTY_CARD_CYCLE_TIME();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		File csvFile = new File(fileName);
		assertTrue(csvFile.exists());
		csvFile.delete();
	}

	@Test
	void shouldThrowExceptionWhenBoardCsvNotExist() {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO_WITH_EMPTY_BASE_INFO();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		assertThrows(FileIOException.class, () -> csvFileGenerator.getDataFromCSV(ReportType.BOARD, 1686710104536L));
		assertThrows(FileIOException.class,
				() -> csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, "15469:89/033"));
	}

	@Test
	void shouldHasContentWhenGetDataFromCsvGivenDataTypeIsBoard() throws IOException {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, mockTimeStamp);
		InputStreamResource inputStreamResource = csvFileGenerator.getDataFromCSV(ReportType.BOARD,
				Long.parseLong(mockTimeStamp));
		InputStream csvDataInputStream = inputStreamResource.getInputStream();
		String boardCsvData = new BufferedReader(new InputStreamReader(csvDataInputStream)).lines()
			.collect(Collectors.joining("\n"));

		Assertions.assertEquals(boardCsvData,
				"\"Issue key\",\"Summary\",\"Issue Type\",\"Status\",\"Status Date\",\"Story Points\",\"assignee\",\"Reporter\",\"Project Key\",\"Project Name\",\"Priority\",\"Parent Summary\",\"Sprint\",\"Labels\",\"Cycle Time\",\"Story point estimate\",\"Flagged\",\"1010\",\"1011\",\"Cycle Time / Story Points\",\"Analysis Days\",\"In Dev Days\",\"Waiting Days\",\"Testing Days\",\"Block Days\",\"Review Days\",\"OriginCycleTime: DOING\",\"OriginCycleTime: BLOCKED\"\n"
						+ "\"ADM-489\",\"summary\",\"issue type\",,\"2023-11-28\",\"2.0\",\"name\",\"name\",\"ADM\",\"Auto Dora Metrics\",\"Medium\",\"parent\",\"sprint 1\",\"\",\"0.90\",\"1.00\",\"\",\"\",\"{}\",\"0.45\",\"0\",\"0.90\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"");

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		Files.deleteIfExists(Path.of(fileName));
	}

	@Test
	void shouldConvertMetricDataToCsv() throws IOException {
		ReportResponse reportResponse = MetricCsvFixture.MOCK_METRIC_CSV_DATA();

		csvFileGenerator.convertMetricDataToCSV(reportResponse, mockTimeStamp);

		String fileName = CSVFileNameEnum.METRIC.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);
		assertTrue(file.exists());

		FileInputStream fileInputStream = new FileInputStream(file);
		BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
		String headers = reader.readLine();
		Assertions.assertEquals("\"Group\",\"Metrics\",\"Value\"", headers);
		String firstLine = reader.readLine();
		Assertions.assertEquals("\"Velocity\",\"Velocity(Story Point)\",\"7.0\"", firstLine);
		reader.close();
		fileInputStream.close();
		boolean delete = file.delete();
		assertTrue(delete);
	}

	@Test
	void shouldMakeCsvDirWhenNotExistGivenDataTypeIsMetric() throws IOException {
		String csvDirPath = "./csv";
		File csvDir = new File(csvDirPath);
		deleteDirectory(csvDir);
		ReportResponse reportResponse = MetricCsvFixture.MOCK_METRIC_CSV_DATA();

		csvFileGenerator.convertMetricDataToCSV(reportResponse, mockTimeStamp);

		Path filePath = Path.of(CSVFileNameEnum.METRIC.getValue() + "-" + mockTimeStamp + ".csv");
		assertTrue(Files.exists(filePath));
		Files.deleteIfExists(filePath);
	}

	@Test
	void shouldThrowExceptionWhenMetricCsvNotExist() {
		ReportResponse reportResponse = MetricCsvFixture.MOCK_METRIC_CSV_DATA();

		assertThrows(FileIOException.class, () -> csvFileGenerator.getDataFromCSV(ReportType.METRIC, 1686710104536L));
		assertThrows(FileIOException.class,
				() -> csvFileGenerator.convertMetricDataToCSV(reportResponse, "15469:89/033"));
	}

	@Test
	void shouldHasContentWhenGetDataFromCsvGivenDataTypeIsMetric() throws IOException {
		ReportResponse reportResponse = MetricCsvFixture.MOCK_METRIC_CSV_DATA();

		csvFileGenerator.convertMetricDataToCSV(reportResponse, mockTimeStamp);

		InputStreamResource inputStreamResource = csvFileGenerator.getDataFromCSV(ReportType.METRIC,
				Long.parseLong(mockTimeStamp));
		InputStream csvDataInputStream = inputStreamResource.getInputStream();
		String metricCsvData = new BufferedReader(new InputStreamReader(csvDataInputStream)).lines()
			.collect(Collectors.joining("\n"));

		Assertions.assertEquals(metricCsvData,
				"""
						"Group","Metrics","Value"
						"Velocity","Velocity(Story Point)","7.0"
						"Velocity","Throughput(Cards Count)","2"
						"Cycle time","Average cycle time(days/storyPoint)","4.18"
						"Cycle time","Average cycle time(days/card)","9.75"
						"Cycle time","Total development time / Total cycle time","62.10"
						"Cycle time","Total block time / Total cycle time","0.34"
						"Cycle time","Total review time / Total cycle time","37.39"
						"Cycle time","Total testing time / Total cycle time","0.17"
						"Cycle time","Total  time / Total cycle time","0.17"
						"Cycle time","Average development time(days/storyPoint)","2.60"
						"Cycle time","Average development time(days/card)","6.06"
						"Cycle time","Average block time(days/storyPoint)","0.01"
						"Cycle time","Average block time(days/card)","0.03"
						"Cycle time","Average review time(days/storyPoint)","1.56"
						"Cycle time","Average review time(days/card)","3.65"
						"Cycle time","Average testing time(days/storyPoint)","0.01"
						"Cycle time","Average testing time(days/card)","0.02"
						"Cycle time","Average  time(days/storyPoint)","0.01"
						"Cycle time","Average  time(days/card)","0.02"
						"Classifications","Issue Type / Bug","33.33"
						"Classifications","Issue Type / Story","66.67"
						"Deployment frequency","Heartbeat / Deploy prod / Deployment frequency(Deployments/Day)","0.78"
						"Deployment frequency","Heartbeat / Check Frontend License / Deployment frequency(Deployments/Day)","0.56"
						"Deployment frequency","Average / Deployment frequency(Deployments/Day)","0.67"
						"Lead time for changes","Heartbeat / Deploy prod / PR Lead Time","0"
						"Lead time for changes","Heartbeat / Deploy prod / Pipeline Lead Time","0.02"
						"Lead time for changes","Heartbeat / Deploy prod / Total Lead Time","0.02"
						"Lead time for changes","Heartbeat / Check Frontend License / PR Lead Time","0"
						"Lead time for changes","Heartbeat / Check Frontend License / Pipeline Lead Time","0.09"
						"Lead time for changes","Heartbeat / Check Frontend License / Total Lead Time","0.09"
						"Lead time for changes","Average / PR Lead Time","0"
						"Lead time for changes","Average / Pipeline Lead Time","0.05"
						"Lead time for changes","Average / Total Lead Time","0.05"
						"Dev change failure rate","Heartbeat / Deploy prod / Dev change failure rate","0.0000"
						"Dev change failure rate","Heartbeat / Check Frontend License / Dev change failure rate","0.0000"
						"Dev change failure rate","Average / Dev change failure rate","0"
						"Dev mean time to recovery","Heartbeat / Deploy prod / Dev mean time to recovery","0"
						"Dev mean time to recovery","Heartbeat / Check Frontend License / Dev mean time to recovery","0"
						"Dev mean time to recovery","Average / Dev mean time to recovery","0\"""");

		String fileName = CSVFileNameEnum.METRIC.getValue() + "-" + mockTimeStamp + ".csv";
		Files.deleteIfExists(Path.of(fileName));
	}

	@Test
	void shouldHasNoContentWhenGetDataFromCsvGivenDataTypeIsMetricAndResponseIsEmpty() throws IOException {
		ReportResponse reportResponse = MetricCsvFixture.MOCK_EMPTY_METRIC_CSV_DATA();

		csvFileGenerator.convertMetricDataToCSV(reportResponse, mockTimeStamp);
		InputStreamResource inputStreamResource = csvFileGenerator.getDataFromCSV(ReportType.METRIC,
				Long.parseLong(mockTimeStamp));
		InputStream csvDataInputStream = inputStreamResource.getInputStream();
		String metricCsvData = new BufferedReader(new InputStreamReader(csvDataInputStream)).lines()
			.collect(Collectors.joining("\n"));

		Assertions.assertEquals(metricCsvData, "\"Group\",\"Metrics\",\"Value\"");

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		Files.deleteIfExists(Path.of(fileName));
	}

	@Test
	void shouldHasNoContentForAveragesWhenGetDataFromCsvGivenDataTypeIsMetricAndTheQuantityOfPipelineIsEqualToOne()
			throws IOException {
		ReportResponse reportResponse = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();

		csvFileGenerator.convertMetricDataToCSV(reportResponse, mockTimeStamp);
		InputStreamResource inputStreamResource = csvFileGenerator.getDataFromCSV(ReportType.METRIC,
				Long.parseLong(mockTimeStamp));
		InputStream csvDataInputStream = inputStreamResource.getInputStream();
		String metricCsvData = new BufferedReader(new InputStreamReader(csvDataInputStream)).lines()
			.collect(Collectors.joining("\n"));

		Assertions.assertEquals(metricCsvData, """
				"Group","Metrics","Value"
				"Rework","Total rework times","3"
				"Rework","Total rework cards","3"
				"Rework","Rework cards ratio(Total rework cards/Throughput)","0.9900"
				"Deployment frequency","Heartbeat / Deploy prod / Deployment frequency(Deployments/Day)","0.78"
				"Lead time for changes","Heartbeat / Deploy prod / PR Lead Time","0"
				"Lead time for changes","Heartbeat / Deploy prod / Pipeline Lead Time","0.02"
				"Lead time for changes","Heartbeat / Deploy prod / Total Lead Time","0.02"
				"Dev change failure rate","Heartbeat / Deploy prod / Dev change failure rate","0.0000"
				"Dev mean time to recovery","Heartbeat / Deploy prod / Dev mean time to recovery","0\"""");

		String fileName = CSVFileNameEnum.BOARD.getValue() + "-" + mockTimeStamp + ".csv";
		Files.deleteIfExists(Path.of(fileName));
	}

	@Test
	void shouldThrowGenerateReportExceptionWhenGeneratePipelineCsvAndCsvTimeStampInvalid() {
		List<PipelineCSVInfo> pipelineCSVInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();
		assertThrows(GenerateReportException.class,
				() -> csvFileGenerator.convertPipelineDataToCSV(pipelineCSVInfos, "../"));
	}

	@Test
	void shouldThrowGenerateReportExceptionWhenGenerateBoardCsvAndCsvTimeStampInvalid() {
		List<JiraCardDTO> cardDTOList = BoardCsvFixture.MOCK_JIRA_CARD_DTO();
		List<BoardCSVConfig> fields = BoardCsvFixture.MOCK_ALL_FIELDS();
		List<BoardCSVConfig> extraFields = BoardCsvFixture.MOCK_EXTRA_FIELDS();

		assertThrows(GenerateReportException.class,
				() -> csvFileGenerator.convertBoardDataToCSV(cardDTOList, fields, extraFields, "../"));
	}

	@Test
	void shouldThrowGenerateReportExceptionWhenGenerateMetricsCsvAndCsvTimeStampInvalid() {
		ReportResponse reportResponse = MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE();

		assertThrows(GenerateReportException.class,
				() -> csvFileGenerator.convertMetricDataToCSV(reportResponse, "../"));
	}

}
