package heartbeat.client;

import heartbeat.client.dto.HolidayDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(value = "holidayFeignClient", url = "https://raw.githubusercontent.com/NateScarlet/holiday-cn/master")
public interface HolidayFeignClient {

	@GetMapping(path = "/{year}.json")
	List<HolidayDTO> getHoliday(@PathVariable String year);

}
