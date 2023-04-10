package heartbeat.service.generateReporter;

import heartbeat.controller.report.vo.response.GenerateReporterResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class GenerateReporterService {
	public GenerateReporterResponse calculateVelocity(){
		return GenerateReporterResponse.builder().build();
	}
}
