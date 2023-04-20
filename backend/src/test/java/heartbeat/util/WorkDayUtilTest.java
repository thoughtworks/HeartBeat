package heartbeat.util;

import heartbeat.client.HolidayFeignClient;
import heartbeat.client.dto.HolidayDTO;
import heartbeat.service.report.WorkDayUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkDayUtilTest {

	@InjectMocks
	WorkDayUtil workDayUtil;

	@Mock
	HolidayFeignClient holidayFeignClient;

	@Test
	void shouldReturnDayIsHoliday() {
		String year = "2020";
		List<HolidayDTO> holidayDTOList = List.of(
				HolidayDTO.builder().date("2020-01-01").name("元旦").isOffDay(true).build(),
				HolidayDTO.builder().date("2020-01-19").name("春节").isOffDay(false).build());
		when(holidayFeignClient.getHoliday(year)).thenReturn(holidayDTOList);

		long holidayTime = LocalDate.parse("2020-01-01", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();
		boolean result1 = workDayUtil.verifyIfThisDayHoliday(holidayTime);

		long workdayTime = LocalDate.parse("2020-01-19", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();
		boolean result2 = workDayUtil.verifyIfThisDayHoliday(workdayTime);
		boolean result3 = workDayUtil.verifyIfThisDayHoliday(1111);

		Assertions.assertTrue(result1);
		Assertions.assertFalse(result2);
		Assertions.assertFalse(result3);
	}

	@Test
	void shouldReturnRightWhenCalculateWorkDaysBetween() {
		String year = "2020";
		List<HolidayDTO> holidayDTOList = List.of(
				HolidayDTO.builder().date("2020-01-01").name("元旦").isOffDay(true).build(),
				HolidayDTO.builder().date("2020-01-24").name("春节").isOffDay(true).build(),
				HolidayDTO.builder().date("2020-01-25").name("春节").isOffDay(true).build());
		long startTime = LocalDate.parse("2020-01-01", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();
		long endTime = LocalDate.parse("2020-02-01", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();
		when(holidayFeignClient.getHoliday(year)).thenReturn(holidayDTOList);

		int result = workDayUtil.calculateWorkDaysBetween(startTime, endTime);
		Assertions.assertEquals(21, result);
	}

	@Test
	void shouldReturnRightWhenCalculateWorkDaysBy24Hours() {
		String year = "2020";
		List<HolidayDTO> holidayDTOList = List.of(
				HolidayDTO.builder().date("2020-01-01").name("元旦").isOffDay(true).build(),
				HolidayDTO.builder().date("2020-01-24").name("春节").isOffDay(true).build(),
				HolidayDTO.builder().date("2020-01-25").name("春节").isOffDay(true).build());
		long startTime = LocalDate.parse("2020-01-01", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();
		long endTime = LocalDate.parse("2020-02-01", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();
		when(holidayFeignClient.getHoliday(year)).thenReturn(holidayDTOList);

		double days = workDayUtil.calculateWorkDaysBy24Hours(startTime, endTime);

		Assertions.assertEquals(21, days);
	}

}
