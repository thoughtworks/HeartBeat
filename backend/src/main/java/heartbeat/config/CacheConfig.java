package heartbeat.config;

import heartbeat.client.dto.board.jira.CardHistoryResponseDTO;
import heartbeat.client.dto.board.jira.FieldResponseDTO;
import heartbeat.client.dto.board.jira.JiraBoardConfigDTO;
import heartbeat.client.dto.board.jira.StatusSelfDTO;
import java.time.Duration;
import javax.cache.CacheManager;
import javax.cache.Caching;
import javax.cache.spi.CachingProvider;
import lombok.val;
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
		cacheManager.createCache("sprintInfo", getCacheConfiguration(String.class));
		cacheManager.createCache("jiraConfig", getCacheConfiguration(JiraBoardConfigDTO.class));
		cacheManager.createCache("jiraStatusCategory", getCacheConfiguration(StatusSelfDTO.class));
		cacheManager.createCache("jiraActivityfeed", getCacheConfiguration(CardHistoryResponseDTO.class));
		cacheManager.createCache("targetField", getCacheConfiguration(FieldResponseDTO.class));
		return cacheManager;
	}

	@SuppressWarnings("unchecked")
	private <K, V> javax.cache.configuration.Configuration<K, V> getCacheConfiguration(Class<V> valueType) {
		val offHeap = ResourcePoolsBuilder.newResourcePoolsBuilder().offheap(2, MemoryUnit.MB);
		val timeToLive = Duration.ofSeconds(20);
		CacheConfigurationBuilder<K, V> configuration = CacheConfigurationBuilder
			.newCacheConfigurationBuilder((Class<K>) String.class, valueType, offHeap)
			.withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(timeToLive));

		return Eh107Configuration.fromEhcacheCacheConfiguration(configuration);
	}

}
