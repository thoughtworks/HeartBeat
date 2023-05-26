package heartbeat.service.report;

import heartbeat.controller.report.dto.response.PipelineCsvInfo;
import heartbeat.exception.NotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

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

		List<PipelineCsvInfo> pipelineCsvInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();
		csvFileGenerator.convertPipelineDataToCsv(pipelineCsvInfos, mockTimeStamp);
		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);

		Assertions.assertTrue(file.exists());

		FileInputStream fileInputStream = new FileInputStream(file);
		BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
		String headers = reader.readLine();
		Assertions.assertTrue(headers.equals(
				"\"Pipeline Name\",\"Pipeline Step\",\"Build Number\",\"Committer\",\"First Code Committed Time In PR\",\"Code Committed Time\",\"PR Created Time\",\"PR Merged Time\",\"Deployment Completed Time\",\"Total Lead Time (HH:mm:ss)\",\"Time from PR Created to PR Merged (HH:mm:ss)\",\"Time from PR Merged to Deployment Completed (HH:mm:ss)\",\"Status\""));
		String firstLine = reader.readLine();
		Assertions.assertTrue(firstLine.equals(
				"\"Heartbeat\",\":rocket: Deploy prod\",\"880\",\"XXXX\",\"2023-05-08T07:18:18Z\",\"2023-05-10T06:43:02.653Z\",\"168369327000\",\"1683793037000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\""));
		reader.close();
		fileInputStream.close();
		file.delete();
	}

	@Test
	public void shouldMakeCsvDirWhenNotExist() {
		String csvDirPath = "./csv";
		File csvDir = new File(csvDirPath);
		deleteDirectory(csvDir);
		List<PipelineCsvInfo> pipelineCsvInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();

		csvFileGenerator.convertPipelineDataToCsv(pipelineCsvInfos, mockTimeStamp);

		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);
		Assertions.assertTrue(file.exists());
		file.delete();
	}

	@Test
	public void shouldHasContentWhenGetDataFromCsv() {
		List<PipelineCsvInfo> pipelineCsvInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();
		csvFileGenerator.convertPipelineDataToCsv(pipelineCsvInfos, mockTimeStamp);

		String csvPipelineString = csvFileGenerator.getDataFromCsv("pipeline", Long.parseLong(mockTimeStamp));

		System.out.println(csvPipelineString);
		Assertions.assertTrue(csvPipelineString.length() > 0);
		Assertions.assertTrue(csvPipelineString
			.equals("\"Pipeline Name\",\"Pipeline Step\",\"Build Number\",\"Committer\",\"First Code Committed Time In PR\",\"Code Committed Time\",\"PR Created Time\",\"PR Merged Time\",\"Deployment Completed Time\",\"Total Lead Time (HH:mm:ss)\",\"Time from PR Created to PR Merged (HH:mm:ss)\",\"Time from PR Merged to Deployment Completed (HH:mm:ss)\",\"Status\"\n"
					+ "\"Heartbeat\",\":rocket: Deploy prod\",\"880\",\"XXXX\",\"2023-05-08T07:18:18Z\",\"2023-05-10T06:43:02.653Z\",\"168369327000\",\"1683793037000\",\"1684793037000\",\"8379303\",\"16837\",\"653037000\",\"passed\"\n"));

		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + mockTimeStamp + ".csv";
		File file = new File(fileName);
		file.delete();
	}

	@Test
	public void shouldReturnEmptyWhenDataTypeNotMatch() {
		String result = csvFileGenerator.getDataFromCsv("mockDataType", Long.parseLong(mockTimeStamp));

		Assertions.assertEquals(0, result.length());
	}

	@Test
	public void shouldThrowExceptionWhenFileNotExist() {
		List<PipelineCsvInfo> pipelineCsvInfos = PipelineCsvFixture.MOCK_PIPELINE_CSV_DATA();
		assertThrows(NotFoundException.class, () -> csvFileGenerator.getDataFromCsv("pipeline", 123456L));
		assertThrows(NotFoundException.class,
				() -> csvFileGenerator.convertPipelineDataToCsv(pipelineCsvInfos, "15469:89/033"));
	}

}
