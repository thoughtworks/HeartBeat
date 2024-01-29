package heartbeat.handler;

import com.google.gson.Gson;
import heartbeat.exception.BaseException;
import heartbeat.handler.base.AsyncDataBaseHandler;
import heartbeat.handler.base.AsyncExceptionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.File;

import static heartbeat.handler.base.FIleType.ERROR;

@Component
@RequiredArgsConstructor
public class AsyncExceptionHandler extends AsyncDataBaseHandler {

	public void put(String reportId, BaseException e) {
		createFileByType(ERROR, reportId, new Gson().toJson(e));
	}

	public BaseException get(String reportId) {
		return readFileByType(ERROR, reportId, AsyncExceptionDTO.class);
	}

	public BaseException remove(String reportId) {
		return readAndRemoveFileByType(ERROR, reportId, AsyncExceptionDTO.class);
	}

	public void deleteExpireExceptionFile(long currentTimeStamp, File directory) {
		deleteExpireFileByType(ERROR, currentTimeStamp, directory);
	}

}
