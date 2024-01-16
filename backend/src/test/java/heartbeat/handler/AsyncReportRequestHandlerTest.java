package heartbeat.handler;

import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.GenerateReportException;
import heartbeat.util.IdUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AsyncReportRequestHandlerTest {

	@InjectMocks
	AsyncReportRequestHandler asyncReportRequestHandler;

	@Test
	void shouldDeleteReportWhenReportIsExpire() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String expireTime = Long.toString(currentTimeMillis - 1900000L);
		String boardReportId1 = IdUtil.getBoardReportId(currentTime);
		String boardReportId2 = IdUtil.getBoardReportId(expireTime);
		asyncReportRequestHandler.putReport(boardReportId1, ReportResponse.builder().build());
		asyncReportRequestHandler.putReport(boardReportId2, ReportResponse.builder().build());

		asyncReportRequestHandler.deleteExpireReport(currentTimeMillis);

		assertNull(asyncReportRequestHandler.getReport(boardReportId2));
		assertNotNull(asyncReportRequestHandler.getReport(boardReportId1));
	}

	@Test
	void shouldGetAsyncReportWhenPuttingReportIntoAsyncReportRequestHandler() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String boardReportId = IdUtil.getBoardReportId(currentTime);
		asyncReportRequestHandler.putReport(boardReportId, ReportResponse.builder().build());

		assertNotNull(asyncReportRequestHandler.getReport(boardReportId));
	}

	@Test
	void shouldDeleteMetricsDataReadyWhenExpireIsExpire() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String expireTime = Long.toString(currentTimeMillis - 1900000L);
		MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder().boardMetricsCompleted(false).build();
		asyncReportRequestHandler.putMetricsDataCompleted(currentTime, metricsDataCompleted);
		asyncReportRequestHandler.putMetricsDataCompleted(expireTime, metricsDataCompleted);

		asyncReportRequestHandler.deleteExpireMetricsDataCompleted(currentTimeMillis);

		assertNull(asyncReportRequestHandler.getMetricsDataCompleted(expireTime));
		assertNotNull(asyncReportRequestHandler.getMetricsDataCompleted(currentTime));
	}

	@Test
	void shouldGetAsyncMetricsDataReadyWhenPuttingMetricsReadyIntoAsyncReportRequestHandler() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder().boardMetricsCompleted(false).build();
		asyncReportRequestHandler.putMetricsDataCompleted(currentTime, metricsDataCompleted);

		assertNotNull(asyncReportRequestHandler.getMetricsDataCompleted(currentTime));
	}

	@Test
	void shouldThrowGenerateReportExceptionWhenPreviousMetricsDataReadyIsNull() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);

		Exception exception = assertThrows(GenerateReportException.class,
				() -> asyncReportRequestHandler.isReportReady(currentTime));
		assertEquals("Failed to locate the report using this report ID.", exception.getMessage());
	}

	@Test
	void shouldReturnFalseWhenExistFalseValue() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder()
			.boardMetricsCompleted(false)
			.sourceControlMetricsCompleted(false)
			.pipelineMetricsCompleted(null)
			.build();
		asyncReportRequestHandler.putMetricsDataCompleted(currentTime, metricsDataCompleted);

		boolean reportReady = asyncReportRequestHandler.isReportReady(currentTime);

		assertFalse(reportReady);
	}

	@Test
	void shouldReturnTrueWhenNotExistFalseValue() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder()
			.boardMetricsCompleted(true)
			.sourceControlMetricsCompleted(null)
			.pipelineMetricsCompleted(true)
			.build();
		asyncReportRequestHandler.putMetricsDataCompleted(currentTime, metricsDataCompleted);

		boolean reportReady = asyncReportRequestHandler.isReportReady(currentTime);

		assertTrue(reportReady);
	}

}
