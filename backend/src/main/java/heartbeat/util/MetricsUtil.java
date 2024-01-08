package heartbeat.util;

import heartbeat.controller.report.dto.request.RequireDataEnum;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public interface MetricsUtil {

	List<String> kanbanMetrics = Stream
		.of(RequireDataEnum.VELOCITY, RequireDataEnum.CYCLE_TIME, RequireDataEnum.CLASSIFICATION)
		.map(RequireDataEnum::getValue)
		.toList();

	List<String> buildKiteMetrics = Stream
		.of(RequireDataEnum.CHANGE_FAILURE_RATE, RequireDataEnum.DEPLOYMENT_FREQUENCY,
				RequireDataEnum.MEAN_TIME_TO_RECOVERY)
		.map(RequireDataEnum::getValue)
		.toList();

	List<String> codebaseMetrics = Stream.of(RequireDataEnum.LEAD_TIME_FOR_CHANGES)
		.map(RequireDataEnum::getValue)
		.toList();

	static List<String> getPipelineMetrics(List<String> metrics) {
		return metrics.stream().filter(buildKiteMetrics::contains).collect(Collectors.toList());
	}

	static List<String> getCodeBaseMetrics(List<String> metrics) {
		return metrics.stream().filter(codebaseMetrics::contains).collect(Collectors.toList());

	}

	static List<String> getBoardMetrics(List<String> metrics) {
		return metrics.stream().filter(kanbanMetrics::contains).collect(Collectors.toList());
	}

}
