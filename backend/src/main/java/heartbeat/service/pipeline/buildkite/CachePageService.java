package heartbeat.service.pipeline.buildkite;

import heartbeat.client.BuildKiteFeignClient;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.PageStepsInfoDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
@Log4j2
public class CachePageService {

	public static final String BUILD_KITE_LINK_HEADER = HttpHeaders.LINK;

	private final BuildKiteFeignClient buildKiteFeignClient;

	@Cacheable(cacheNames = "pageStepsInfo", key = "#realToken+'-'+#orgId+'-'+#pipelineId+'-'+#page+'-'+#perPage+'-'"
			+ "+#createdFrom+'-'+#createdTo+'-'+(#branches!=null ? #branches.toString() : '')")
	public PageStepsInfoDto fetchPageStepsInfo(String realToken, String orgId, String pipelineId, String page,
			String perPage, String createdFrom, String createdTo, List<String> branches) {
		ResponseEntity<List<BuildKiteBuildInfo>> pipelineStepsInfo = buildKiteFeignClient.getPipelineSteps(realToken,
				orgId, pipelineId, page, perPage, createdFrom, createdTo, branches);

		log.info(
				"Successfully get paginated pipeline steps pagination info, orgId: {},pipelineId: {}, createdFrom: {},  createdTo: {}, result status code: {}, page:{}",
				orgId, pipelineId, createdFrom, createdTo, pipelineStepsInfo.getStatusCode(), page);

		int totalPage = parseTotalPage(pipelineStepsInfo.getHeaders().get(BUILD_KITE_LINK_HEADER));
		log.info("Successfully parse the total page_total page: {}", totalPage);
		List<BuildKiteBuildInfo> firstPageStepsInfo = pipelineStepsInfo.getBody();
		return PageStepsInfoDto.builder().firstPageStepsInfo(firstPageStepsInfo).totalPage(totalPage).build();
	}

	private int parseTotalPage(@Nullable List<String> linkHeader) {
		if (linkHeader == null) {
			return 1;
		}
		String lastLink = linkHeader.stream().map(link -> link.replaceAll("per_page=\\d+", "")).findFirst().orElse("");
		Matcher matcher = Pattern.compile("page=(\\d+)[^>]*>;\\s*rel=\"last\"").matcher(lastLink);
		if (matcher.find()) {
			return Integer.parseInt(matcher.group(1));
		}
		return 1;
	}

}
