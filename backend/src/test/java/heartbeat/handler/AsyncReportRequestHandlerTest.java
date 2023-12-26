package heartbeat.handler;

import heartbeat.controller.report.dto.response.MetricsDataReady;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.GenerateReportException;
import heartbeat.util.IdUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AsyncReportRequestHandlerTest {

	@InjectMocks
	AsyncReportRequestHandler asyncReportRequestHandler;

	@Test
	void shouldDeleteExpireReport() {
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
	void shouldPutAndGetAsyncReport() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String boardReportId = IdUtil.getBoardReportId(currentTime);
		asyncReportRequestHandler.putReport(boardReportId, ReportResponse.builder().build());

		assertNotNull(asyncReportRequestHandler.getReport(boardReportId));
	}

	@Test
	void shouldDeleteExpireMetricsDataReady() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String expireTime = Long.toString(currentTimeMillis - 1900000L);
		MetricsDataReady metricsDataReady = MetricsDataReady.builder().boardMetricsReady(false).build();
		asyncReportRequestHandler.putMetricsDataReady(currentTime, metricsDataReady);
		asyncReportRequestHandler.putMetricsDataReady(expireTime, metricsDataReady);

		asyncReportRequestHandler.deleteExpireMetricsDataReady(currentTimeMillis);

		assertNull(asyncReportRequestHandler.getMetricsDataReady(expireTime));
		assertNotNull(asyncReportRequestHandler.getMetricsDataReady(currentTime));
	}

	@Test
	void shouldPutAndGetAsyncMetricsDataReady() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		MetricsDataReady metricsDataReady = MetricsDataReady.builder().boardMetricsReady(false).build();
		asyncReportRequestHandler.putMetricsDataReady(currentTime, metricsDataReady);

		assertNotNull(asyncReportRequestHandler.getMetricsDataReady(currentTime));
	}

	@Test
	void shouldThrowGenerateReportExceptionWhenPreviousMetricsDataReadyIsNull() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		when(asyncReportRequestHandler.getMetricsDataReady(currentTime)).thenReturn(null);

		Exception exception = assertThrows(GenerateReportException.class,
				() -> asyncReportRequestHandler.isReportReady(currentTime));
		assertEquals("Unable to locate the report using this report ID.", exception.getMessage());
	}

	@Test
	void shouldReturnFalseWhenExistFalseValue() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		MetricsDataReady metricsDataReady = MetricsDataReady.builder()
			.boardMetricsReady(false)
			.sourceControlMetricsReady(false)
			.pipelineMetricsReady(null)
			.build();
		asyncReportRequestHandler.putMetricsDataReady(currentTime, metricsDataReady);

		boolean reportReady = asyncReportRequestHandler.isReportReady(currentTime);

		assertFalse(reportReady);
	}

	@Test
	void shouldReturnTrueWhenNotExistFalseValue() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		MetricsDataReady metricsDataReady = MetricsDataReady.builder()
			.boardMetricsReady(true)
			.sourceControlMetricsReady(null)
			.pipelineMetricsReady(true)
			.build();
		asyncReportRequestHandler.putMetricsDataReady(currentTime, metricsDataReady);

		boolean reportReady = asyncReportRequestHandler.isReportReady(currentTime);

		assertTrue(reportReady);
	}

}
