package heartbeat.handler;

import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.exception.GenerateReportException;
import org.apache.commons.io.FileUtils;
import org.junit.Assert;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
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

	@Test
	void shouldDeleteMetricsDataReadyWhenExpireIsExpire() throws IOException {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		String expireTime = Long.toString(currentTimeMillis - 1900000L);
		MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder().boardMetricsCompleted(false).build();
		asyncMetricsDataHandler.putMetricsDataCompleted(currentTime, metricsDataCompleted);
		asyncMetricsDataHandler.putMetricsDataCompleted(expireTime, metricsDataCompleted);

		asyncMetricsDataHandler.deleteExpireMetricsDataCompletedFile(currentTimeMillis, new File(APP_OUTPUT_METRICS));

		assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(expireTime));
		assertNotNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
		Files.deleteIfExists(Path.of(APP_OUTPUT_METRICS + "/" + currentTime));
		assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
	}

	@Test
	void shouldGetAsyncMetricsDataReadyWhenPuttingMetricsReadyIntoAsyncReportRequestHandler() throws IOException {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder().boardMetricsCompleted(false).build();

		asyncMetricsDataHandler.putMetricsDataCompleted(currentTime, metricsDataCompleted);

		assertNotNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
		Files.deleteIfExists(Path.of(APP_OUTPUT_METRICS + "/" + currentTime));
		assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
	}

	@Test
	void shouldHangUntilFileIsDeletedWhenPuttingMetricsReadyIntoAsyncReportRequestHandler()
			throws IOException, InterruptedException {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder().boardMetricsCompleted(false).build();
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
	void shouldThrowGenerateReportExceptionWhenPreviousMetricsDataReadyIsNull() {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);

		Exception exception = assertThrows(GenerateReportException.class,
				() -> asyncMetricsDataHandler.isReportReady(currentTime));

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
		asyncMetricsDataHandler.putMetricsDataCompleted(currentTime, metricsDataCompleted);

		boolean reportReady = asyncMetricsDataHandler.isReportReady(currentTime);

		assertFalse(reportReady);
		new File(APP_OUTPUT_METRICS + "/" + currentTime).delete();
		assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
	}

	@Test
	void shouldReturnTrueWhenNotExistFalseValue() throws IOException {
		long currentTimeMillis = System.currentTimeMillis();
		String currentTime = Long.toString(currentTimeMillis);
		MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder()
			.boardMetricsCompleted(true)
			.sourceControlMetricsCompleted(null)
			.pipelineMetricsCompleted(true)
			.build();
		asyncMetricsDataHandler.putMetricsDataCompleted(currentTime, metricsDataCompleted);

		boolean reportReady = asyncMetricsDataHandler.isReportReady(currentTime);

		assertTrue(reportReady);
		Files.deleteIfExists(Path.of(APP_OUTPUT_METRICS + "/" + currentTime));
		assertNull(asyncMetricsDataHandler.getMetricsDataCompleted(currentTime));
	}

	@Test
	void shouldThrowGenerateReportExceptionGivenFileNameInvalidWhenHandlerPutMetricsData() {
		Assert.assertThrows(GenerateReportException.class,
				() -> asyncMetricsDataHandler.putMetricsDataCompleted("../", MetricsDataCompleted.builder().build()));
	}

	private void createLockFile(String currentTime) throws IOException {
		String fileName = APP_OUTPUT_METRICS + "/" + currentTime + ".lock";
		File file = new File(fileName);
		file.getParentFile().mkdirs();
		file.createNewFile();
	}

}
