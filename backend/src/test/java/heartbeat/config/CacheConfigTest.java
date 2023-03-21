package heartbeat.config;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.core.AutoConfigureCache;
import org.springframework.cache.CacheManager;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = CacheConfig.class)
@AutoConfigureCache
public class CacheConfigTest {

	@Autowired
	private CacheManager cacheManager;

	@Test
	public void testCacheManagerCreation() {
		assertNotNull(cacheManager);
	}

}
