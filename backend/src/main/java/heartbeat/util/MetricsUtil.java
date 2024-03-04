package heartbeat.util;

import heartbeat.controller.report.dto.request.MetricEnum;

import java.util.List;
import java.util.stream.Stream;

public interface MetricsUtil {

	List<String> kanbanMetrics = Stream.of(MetricEnum.VELOCITY, MetricEnum.CYCLE_TIME, MetricEnum.CLASSIFICATION)
		.map(MetricEnum::getValue)
		.toList();

	List<String> buildKiteMetrics = Stream
		.of(MetricEnum.CHANGE_FAILURE_RATE, MetricEnum.DEPLOYMENT_FREQUENCY, MetricEnum.MEAN_TIME_TO_RECOVERY)
		.map(MetricEnum::getValue)
		.toList();

	List<String> codebaseMetrics = Stream.of(MetricEnum.LEAD_TIME_FOR_CHANGES).map(MetricEnum::getValue).toList();

}
