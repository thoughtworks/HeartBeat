package heartbeat.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = { ThreadPoolConfig.class })
public class ThreadPoolConfigTest {

	@Autowired
	@Qualifier("taskExecutor")
	private ThreadPoolTaskExecutor executor;

	@Test
	public void testThreadPoolConfiguration() {
		assertNotNull(executor);
		assertEquals(10, executor.getCorePoolSize());
		assertEquals(100, executor.getMaxPoolSize());
		assertEquals(500, executor.getQueueCapacity());
		assertEquals(60, executor.getKeepAliveSeconds());
		assertEquals("Heartbeat-", executor.getThreadNamePrefix());
	}

}
