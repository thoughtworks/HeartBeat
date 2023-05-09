package heartbeat.config;

import java.time.Duration;
import javax.cache.CacheManager;
import javax.cache.Caching;
import javax.cache.spi.CachingProvider;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.ExpiryPolicyBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.config.units.MemoryUnit;
import org.ehcache.jsr107.Eh107Configuration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

	@Bean
	public CacheManager ehCacheManager() {
		CachingProvider provider = Caching.getCachingProvider();
		CacheManager cacheManager = provider.getCacheManager();

		CacheConfigurationBuilder<Object, Object> configuration = CacheConfigurationBuilder
			.newCacheConfigurationBuilder(Object.class, Object.class,
					ResourcePoolsBuilder.newResourcePoolsBuilder().offheap(1, MemoryUnit.MB))
			.withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(20)));

		javax.cache.configuration.Configuration<Object, Object> stringDoubleConfiguration = Eh107Configuration
			.fromEhcacheCacheConfiguration(configuration);

		cacheManager.createCache("jiraConfig", stringDoubleConfiguration);
		cacheManager.createCache("jiraStatusCategory", stringDoubleConfiguration);
		cacheManager.createCache("jiraActivityfeed", stringDoubleConfiguration);
		cacheManager.createCache("targetField", stringDoubleConfiguration);
		return cacheManager;
	}

}
