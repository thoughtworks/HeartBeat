package heartbeat.handler;

import com.google.gson.Gson;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.handler.base.AsyncDataBaseHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.File;

import static heartbeat.handler.base.FIleType.REPORT;

@Component
@RequiredArgsConstructor
public class AsyncReportRequestHandler extends AsyncDataBaseHandler {

	public void putReport(String reportId, ReportResponse e) {
		createFileByType(REPORT, reportId, new Gson().toJson(e));
	}

	public ReportResponse getReport(String reportId) {
		return readFileByType(REPORT, reportId, ReportResponse.class);
	}

	public void deleteExpireReportFile(long currentTimeStamp, File directory) {
		deleteExpireFileByType(REPORT, currentTimeStamp, directory);
	}

}
