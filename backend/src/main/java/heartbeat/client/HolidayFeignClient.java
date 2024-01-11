package heartbeat.client;

import heartbeat.client.dto.board.jira.HolidaysResponseDTO;
import heartbeat.config.HolidayFeignClientConfiguration;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "holidayFeignClient", url = "https://raw.githubusercontent.com/NateScarlet/holiday-cn/master",
		configuration = HolidayFeignClientConfiguration.class)
public interface HolidayFeignClient {

	@Cacheable(cacheNames = "holidayResult", key = "#year")
	@GetMapping(path = "/{year}.json")
	HolidaysResponseDTO getHolidays(@PathVariable String year);

}
