package heartbeat.handler;

import heartbeat.controller.report.dto.request.MetricType;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.exception.GenerateReportException;
import heartbeat.service.report.MetricsDataDTO;
import heartbeat.util.IdUtil;
import org.apache.commons.io.FileUtils;
import org.junit.Assert;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
class AsyncMetricsDataHandlerTest {

	public static final String APP_OUTPUT_METRICS = "./app/output/metrics-data-completed";

	@InjectMocks
	AsyncMetricsDataHandler asyncMetricsDataHandler;

	@AfterEach
	void afterEach() {
		new File(APP_OUTPUT_METRICS).delete();
	}

	@AfterAll
	static void afterAll() {
		try {
			FileUtils.cleanDirectory(new File("./app"));
		}
		catch (IOException ignored) {
		}
	}

	@Nested
	class PutMetricsDataCompleted {

		@Test
		void shouldHangUntilFileIsDeletedWhenPuttingMetricsReadyIntoAsyncReportRequestHandler()
				throws IOException, InterruptedException {
			long currentTimeMillis = System.currentTimeMillis();
			String currentTime = Long.toString(currentTimeMillis);
			MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder()
				.boardMetricsCompleted(false)
				.build();
			createLockFile(currentTime);
			CountDownLatch latch = new CountDownLatch(1);
			Thread thread = new Thread(() -> {
				asyncMetricsDataHandler.putMetricsDataCompleted(currentTime, metricsDataCompleted);
				latch.countDown();
			});

			thread.start();

			boolean executionContinuous = latch.await(4, TimeUnit.SECONDS);
			assertFalse(executionContinuous);
			thread.interrupt();
			Files.deleteIfExists(Path.of(APP_OUTPUT_METRICS + "/" + currentTime + ".lock"));
			assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
		}

		@Test
		void shouldThrowGenerateReportExceptionGivenFileNameInvalidWhenHandlerPutMetricsData() {
			Assert.assertThrows(GenerateReportException.class, () -> asyncMetricsDataHandler
				.putMetricsDataCompleted("../", MetricsDataCompleted.builder().build()));
		}

	}

	@Nested
	class DeleteExpireMetricsDataCompletedFile {

		@Test
		void shouldDeleteMetricsDataReadyWhenMetricsFileIsExpire() throws IOException {
			long currentTimeMillis = System.currentTimeMillis();
			String prefix = "prefix-";
			String currentTimeFileId = prefix + currentTimeMillis;
			String expireTimeFileId = prefix + (currentTimeMillis - 1900000L);
			MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder()
				.boardMetricsCompleted(false)
				.build();
			asyncMetricsDataHandler.putMetricsDataCompleted(currentTimeFileId, metricsDataCompleted);
			asyncMetricsDataHandler.putMetricsDataCompleted(expireTimeFileId, metricsDataCompleted);

			asyncMetricsDataHandler.deleteExpireMetricsDataCompletedFile(currentTimeMillis,
					new File(APP_OUTPUT_METRICS));

			assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(expireTimeFileId));
			assertNotNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTimeFileId));
			Files.deleteIfExists(Path.of(APP_OUTPUT_METRICS + "/" + currentTimeFileId));
			assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTimeFileId));
		}

	}

	@Nested
	class GetMetricsDataCompleted {

		@Test
		void shouldGetAsyncMetricsDataReadyWhenPuttingMetricsReadyIntoAsyncReportRequestHandler() throws IOException {
			long currentTimeMillis = System.currentTimeMillis();
			String currentTime = Long.toString(currentTimeMillis);
			MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder()
				.boardMetricsCompleted(false)
				.build();

			asyncMetricsDataHandler.putMetricsDataCompleted(currentTime, metricsDataCompleted);

			assertNotNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
			Files.deleteIfExists(Path.of(APP_OUTPUT_METRICS + "/" + currentTime));
			assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
		}

	}

	@Nested
	class UpdateMetricsDataCompletedInHandler {

		@Test
		void shouldThrowGenerateReportExceptionWhenPreviousMetricsStatusIsNull() {
			long currentTimeMillis = System.currentTimeMillis();
			String currentTime = Long.toString(currentTimeMillis);

			GenerateReportException exception = assertThrows(GenerateReportException.class,
					() -> asyncMetricsDataHandler.updateMetricsDataCompletedInHandler(currentTime, MetricType.BOARD));

			assertEquals("Failed to update metrics data completed through this timestamp.", exception.getMessage());
		}

		@Test
		void shouldUpdateBoardMetricDataWhenPreviousMetricsStatusIsNotNullAndMetricTypeIsBoard() throws IOException {
			long currentTimeMillis = System.currentTimeMillis();
			String currentTime = Long.toString(currentTimeMillis);
			MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder()
				.boardMetricsCompleted(false)
				.build();
			asyncMetricsDataHandler.putMetricsDataCompleted(currentTime, metricsDataCompleted);

			asyncMetricsDataHandler.updateMetricsDataCompletedInHandler(currentTime, MetricType.BOARD);

			MetricsDataCompleted completed = asyncMetricsDataHandler.getMetricsDataCompleted(currentTime);
			assertTrue(completed.boardMetricsCompleted());
			Files.deleteIfExists(Path.of(APP_OUTPUT_METRICS + "/" + currentTime));
			assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
		}

		@Test
		void shouldUpdateDoraMetricDataWhenPreviousMetricsStatusIsNotNullAndMetricTypeIsDora() throws IOException {
			long currentTimeMillis = System.currentTimeMillis();
			String currentTime = Long.toString(currentTimeMillis);
			MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder()
				.doraMetricsCompleted(false)
				.build();
			asyncMetricsDataHandler.putMetricsDataCompleted(currentTime, metricsDataCompleted);

			asyncMetricsDataHandler.updateMetricsDataCompletedInHandler(currentTime, MetricType.DORA);

			MetricsDataCompleted completed = asyncMetricsDataHandler.getMetricsDataCompleted(currentTime);
			assertTrue(completed.doraMetricsCompleted());
			Files.deleteIfExists(Path.of(APP_OUTPUT_METRICS + "/" + currentTime));
			assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
		}

	}

	@Nested
	class GetReportReadyStatusByTimeStamp {

		@Test
		void shouldGetReadyFalseAndAllMetricsReadyTrueGivenPreviousMetricsStatusIsNull() throws IOException {
			long currentTimeMillis = System.currentTimeMillis();
			String currentTime = Long.toString(currentTimeMillis);

			MetricsDataDTO result = asyncMetricsDataHandler.getReportReadyStatusByTimeStamp(currentTime);

			assertEquals(false, result.isBoardReady());
			assertEquals(false, result.isDoraReady());
			assertEquals(true, result.isAllMetricsReady());
			Files.deleteIfExists(Path.of(APP_OUTPUT_METRICS + "/" + currentTime));
			assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
		}

		@Test
		void shouldGetReadyTrueAndAllMetricsReadyFalseGivenPreviousMetricsStatusIsNotAllTrue() throws IOException {
			long currentTimeMillis = System.currentTimeMillis();
			String currentTime = Long.toString(currentTimeMillis);
			MetricsDataCompleted boardCompleted = MetricsDataCompleted.builder().boardMetricsCompleted(false).build();
			MetricsDataCompleted doraCompleted = MetricsDataCompleted.builder().doraMetricsCompleted(true).build();
			asyncMetricsDataHandler.putMetricsDataCompleted(IdUtil.getBoardReportId(currentTime), boardCompleted);
			asyncMetricsDataHandler.putMetricsDataCompleted(IdUtil.getDoraReportId(currentTime), doraCompleted);

			MetricsDataDTO result = asyncMetricsDataHandler.getReportReadyStatusByTimeStamp(currentTime);

			assertEquals(false, result.isBoardReady());
			assertEquals(true, result.isDoraReady());
			assertEquals(false, result.isAllMetricsReady());
			Files.deleteIfExists(Path.of(APP_OUTPUT_METRICS + "/" + currentTime));
			assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
		}

		@Test
		void shouldGetReadyTrueAndAllMetricsReadyTrueGivenPreviousMetricsStatusIsAllTrue() throws IOException {
			long currentTimeMillis = System.currentTimeMillis();
			String currentTime = Long.toString(currentTimeMillis);
			MetricsDataCompleted boardCompleted = MetricsDataCompleted.builder().boardMetricsCompleted(true).build();
			MetricsDataCompleted doraCompleted = MetricsDataCompleted.builder().doraMetricsCompleted(true).build();
			asyncMetricsDataHandler.putMetricsDataCompleted(IdUtil.getBoardReportId(currentTime), boardCompleted);
			asyncMetricsDataHandler.putMetricsDataCompleted(IdUtil.getDoraReportId(currentTime), doraCompleted);

			MetricsDataDTO result = asyncMetricsDataHandler.getReportReadyStatusByTimeStamp(currentTime);

			assertEquals(true, result.isBoardReady());
			assertEquals(true, result.isDoraReady());
			assertEquals(true, result.isAllMetricsReady());
			Files.deleteIfExists(Path.of(APP_OUTPUT_METRICS + "/" + currentTime));
			assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
		}

		@Test
		void shouldGetReadyFalseAndAllMetricsReadyFalseGivenPreviousMetricsStatusIsFalse() throws IOException {
			long currentTimeMillis = System.currentTimeMillis();
			String currentTime = Long.toString(currentTimeMillis);
			MetricsDataCompleted boardCompleted = MetricsDataCompleted.builder().boardMetricsCompleted(false).build();
			MetricsDataCompleted doraCompleted = MetricsDataCompleted.builder().doraMetricsCompleted(false).build();
			asyncMetricsDataHandler.putMetricsDataCompleted(IdUtil.getBoardReportId(currentTime), boardCompleted);
			asyncMetricsDataHandler.putMetricsDataCompleted(IdUtil.getDoraReportId(currentTime), doraCompleted);

			MetricsDataDTO result = asyncMetricsDataHandler.getReportReadyStatusByTimeStamp(currentTime);

			assertEquals(false, result.isBoardReady());
			assertEquals(false, result.isDoraReady());
			assertEquals(false, result.isAllMetricsReady());
			Files.deleteIfExists(Path.of(APP_OUTPUT_METRICS + "/" + currentTime));
			assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
		}

	}

	private void createLockFile(String currentTime) throws IOException {
		String fileName = APP_OUTPUT_METRICS + "/" + currentTime + ".lock";
		File file = new File(fileName);
		file.getParentFile().mkdirs();
		file.createNewFile();
	}

}
