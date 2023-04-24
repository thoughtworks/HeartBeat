package heartbeat.client;

import heartbeat.client.dto.board.jira.HolidayResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "holidayFeignClient", url = "https://raw.githubusercontent.com/NateScarlet/holiday-cn/master")
public interface HolidayFeignClient {

	@GetMapping(path = "/{year}.json")
	HolidayResponseDTO getHoliday(@PathVariable String year);

}
