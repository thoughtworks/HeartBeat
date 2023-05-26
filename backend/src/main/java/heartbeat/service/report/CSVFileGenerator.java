package heartbeat.service.report;

import heartbeat.controller.report.dto.response.LeadTimeInfo;
import heartbeat.controller.report.dto.response.PipelineCsvInfo;
import heartbeat.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import com.opencsv.CSVWriter;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@RequiredArgsConstructor
@Component
@Log4j2
public class CSVFileGenerator {

	private static String readStringFromCsvFile(String fileName) {
		try {
			byte[] bytes = Files.readAllBytes(Paths.get(fileName));
			return new String(bytes, StandardCharsets.UTF_8);
		}
		catch (IOException e) {
			throw new NotFoundException(HttpStatus.NOT_FOUND.value(), "this file is not exist");
		}
	}

	public void convertPipelineDataToCsv(List<PipelineCsvInfo> leadTimeData, String csvTimeStamp) {
		log.info("Start to create csv directory");
		boolean created = createCsvDirectory();
		if (created) {
			log.info("Successfully create csv directory");
		}
		else {
			log.info("csv directory is already exist");
		}

		String fileName = CSVFileNameEnum.PIPELINE.getValue() + "-" + csvTimeStamp + ".csv";

		try (CSVWriter csvWriter = new CSVWriter(new FileWriter(fileName))) {
			String[] headers = { "Pipeline Name", "Pipeline Step", "Build Number", "Committer",
					"First Code Committed Time In PR", "Code Committed Time", "PR Created Time", "PR Merged Time",
					"Deployment Completed Time", "Total Lead Time (HH:mm:ss)",
					"Time from PR Created to PR Merged (HH:mm:ss)",
					"Time from PR Merged to Deployment Completed (HH:mm:ss)", "Status" };

			csvWriter.writeNext(headers);

			for (PipelineCsvInfo csvInfo : leadTimeData) {
				String committerName = null;
				String commitDate = null;
				String pipelineName = csvInfo.getPipeLineName();
				String stepName = csvInfo.getStepName();
				String buildNumber = String.valueOf(csvInfo.getBuildInfo().getNumber());
				String state = csvInfo.getDeployInfo().getState();
				if (csvInfo.getCommitInfo() != null) {
					committerName = csvInfo.getCommitInfo().getCommit().getCommitter().getName();
					commitDate = csvInfo.getCommitInfo().getCommit().getCommitter().getDate();
				}

				LeadTimeInfo leadTimeInfo = csvInfo.getLeadTimeInfo();
				String firstCommitTimeInPr = leadTimeInfo.getFirstCommitTimeInPr();
				String prCreatedTime = leadTimeInfo.getPrCreatedTime();
				String prMergedTime = leadTimeInfo.getPrMergedTime();
				String jobFinishTime = leadTimeInfo.getJobFinishTime();
				String totalTime = leadTimeInfo.getTotalTime();
				String prDelayTime = leadTimeInfo.getPrDelayTime();
				String pipelineDelayTime = leadTimeInfo.getPipelineDelayTime();

				String[] rowData = { pipelineName, stepName, buildNumber, committerName, firstCommitTimeInPr,
						commitDate, prCreatedTime, prMergedTime, jobFinishTime, totalTime, prDelayTime,
						pipelineDelayTime, state };

				csvWriter.writeNext(rowData);
			}
		}
		catch (IOException e) {
			throw new NotFoundException(HttpStatus.NOT_FOUND.value(), "this file is not exist");
		}
	}

	public String getDataFromCsv(String dataType, long csvTimeStamp) {
		return switch (dataType) {
			// todo: add board case
			case "pipeline" -> readStringFromCsvFile(CSVFileNameEnum.PIPELINE.getValue() + "-" + csvTimeStamp + ".csv");
			default -> "";
		};
	}

	private boolean createCsvDirectory() {
		String directoryPath = "./csv";
		File directory = new File(directoryPath);
		return directory.mkdirs();
	}

}
