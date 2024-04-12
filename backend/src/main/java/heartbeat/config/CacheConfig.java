package heartbeat.config;

import heartbeat.client.dto.board.jira.CardHistoryResponseDTO;
import heartbeat.client.dto.board.jira.FieldResponseDTO;
import heartbeat.client.dto.board.jira.HolidaysResponseDTO;
import heartbeat.client.dto.board.jira.JiraBoardConfigDTO;
import heartbeat.client.dto.board.jira.JiraBoardProject;
import heartbeat.client.dto.board.jira.JiraBoardVerifyDTO;
import heartbeat.client.dto.board.jira.StatusSelfDTO;
import heartbeat.client.dto.codebase.github.CommitInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteTokenInfo;
import heartbeat.client.dto.pipeline.buildkite.PageBuildKitePipelineInfoDTO;
import heartbeat.client.dto.pipeline.buildkite.PageStepsInfoDto;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.ExpiryPolicyBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.config.units.MemoryUnit;
import org.ehcache.jsr107.Eh107Configuration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.cache.CacheManager;
import javax.cache.Caching;
import javax.cache.spi.CachingProvider;
import java.time.Duration;
import java.util.List;

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
		cacheManager.createCache("jiraActivityFeed", getCacheConfiguration(CardHistoryResponseDTO.class));
		cacheManager.createCache("targetField", getCacheConfiguration(FieldResponseDTO.class));
		cacheManager.createCache("boardVerification", getCacheConfiguration(JiraBoardVerifyDTO.class));
		cacheManager.createCache("boardProject", getCacheConfiguration(JiraBoardProject.class));
		cacheManager.createCache("jiraCards", getCacheConfiguration(String.class));
		cacheManager.createCache("jiraCardHistoryByCount", getCacheConfiguration(CardHistoryResponseDTO.class));
		cacheManager.createCache("holidayResult", getCacheConfiguration(HolidaysResponseDTO.class));
		cacheManager.createCache("tokenInfo", getCacheConfiguration(BuildKiteTokenInfo.class));
		cacheManager.createCache("buildKiteOrganizationInfo", getCacheConfiguration(List.class));
		cacheManager.createCache("pagePipelineInfo", getCacheConfiguration(PageBuildKitePipelineInfoDTO.class));
		cacheManager.createCache("pageStepsInfo", getCacheConfiguration(PageStepsInfoDto.class));
		cacheManager.createCache("pipelineStepsInfo", getCacheConfiguration(List.class));
		cacheManager.createCache("githubOrganizationInfo", getCacheConfiguration(List.class));
		cacheManager.createCache("githubAllRepos", getCacheConfiguration(List.class));
		cacheManager.createCache("githubRepos", getCacheConfiguration(List.class));
		cacheManager.createCache("commitInfo", getCacheConfiguration(CommitInfo.class));
		cacheManager.createCache("pullRequestCommitInfo", getCacheConfiguration(List.class));
		cacheManager.createCache("pullRequestListInfo", getCacheConfiguration(List.class));
		return cacheManager;
	}

	@SuppressWarnings("unchecked")
	private <K, V> javax.cache.configuration.Configuration<K, V> getCacheConfiguration(Class<V> valueType) {
		ResourcePoolsBuilder offHeap;
		if (valueType == String.class) {
			offHeap = ResourcePoolsBuilder.newResourcePoolsBuilder().offheap(4, MemoryUnit.MB);
		}
		else {
			offHeap = ResourcePoolsBuilder.newResourcePoolsBuilder().offheap(2, MemoryUnit.MB);
		}
		Duration timeToLive;
		if (valueType == HolidaysResponseDTO.class) {
			timeToLive = Duration.ofSeconds(300);
		}
		else {
			timeToLive = Duration.ofSeconds(90);
		}
		CacheConfigurationBuilder<K, V> configuration = CacheConfigurationBuilder
			.newCacheConfigurationBuilder((Class<K>) String.class, valueType, offHeap)
			.withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(timeToLive));

		return Eh107Configuration.fromEhcacheCacheConfiguration(configuration);
	}

}
