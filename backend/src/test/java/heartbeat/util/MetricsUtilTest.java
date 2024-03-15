package heartbeat.util;

import heartbeat.controller.report.dto.request.MetricEnum;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

class MetricsUtilTest {

	@Test
	void shouldGetRelatedPartMetrics() {
		List<String> kanbanMetrics = MetricsUtil.KANBAN_METRICS.getValue();
		List<String> buildKiteMetrics = MetricsUtil.BUILDKITE_METRICS.getValue();
		List<String> codebaseMetrics = MetricsUtil.CODEBASE_METRICS.getValue();

		List<String> expectedKanbanMetrics = List.of(MetricEnum.VELOCITY.getValue(), MetricEnum.CYCLE_TIME.getValue(),
				MetricEnum.CLASSIFICATION.getValue(), MetricEnum.REWORK_TIMES.getValue());
		List<String> expectedBuildKiteMetrics = List.of(MetricEnum.DEV_CHANGE_FAILURE_RATE.getValue(),
				MetricEnum.DEPLOYMENT_FREQUENCY.getValue(), MetricEnum.DEV_MEAN_TIME_TO_RECOVERY.getValue());
		List<String> expectedCodebaseMetrics = List.of(MetricEnum.LEAD_TIME_FOR_CHANGES.getValue());

		Assertions.assertEquals(expectedKanbanMetrics, kanbanMetrics);
		Assertions.assertEquals(expectedBuildKiteMetrics, buildKiteMetrics);
		Assertions.assertEquals(expectedCodebaseMetrics, codebaseMetrics);
	}

}
