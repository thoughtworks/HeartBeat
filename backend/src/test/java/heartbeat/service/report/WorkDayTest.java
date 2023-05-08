package heartbeat.service.report;

import heartbeat.client.HolidayFeignClient;
import heartbeat.client.dto.board.jira.HolidayDTO;
import heartbeat.client.dto.board.jira.HolidaysResponseDTO;
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
class WorkDayTest {

	@InjectMocks
	WorkDay workDay;

	@Mock
	HolidayFeignClient holidayFeignClient;

	@Test
	void shouldReturnDayIsHoliday() {
		String year = "2020";
		List<HolidayDTO> holidayDTOList = List.of(
				HolidayDTO.builder().date("2020-01-01").name("元旦").isOffDay(true).build(),
				HolidayDTO.builder().date("2020-01-19").name("春节").isOffDay(false).build());

		long holidayTime = LocalDate.parse("2020-01-01", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();

		long workdayTime = LocalDate.parse("2020-01-19", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();
		when(holidayFeignClient.getHolidays(year))
			.thenReturn(HolidaysResponseDTO.builder().days(holidayDTOList).build());

		boolean result1 = workDay.verifyIfThisDayHoliday(holidayTime);
		boolean result2 = workDay.verifyIfThisDayHoliday(workdayTime);

		Assertions.assertTrue(result1);
		Assertions.assertFalse(result2);
	}

	@Test
	void shouldReturnRightWorkDaysWhenCalculateWorkDaysBetween() {
		when(holidayFeignClient.getHolidays("2020"))
			.thenReturn(HolidaysResponseDTO.builder().days(WorkDayFixture.HOLIDAYS_DATA()).build());
		int result = workDay.calculateWorkDaysBetween(WorkDayFixture.START_TIME(), WorkDayFixture.END_TIME());

		Assertions.assertEquals(21, result);
	}

	@Test
	void shouldReturnRightWorkDaysWhenCalculateWorkDaysBy24Hours() {
		when(holidayFeignClient.getHolidays("2020"))
			.thenReturn(HolidaysResponseDTO.builder().days(WorkDayFixture.HOLIDAYS_DATA()).build());
		double days = workDay.calculateWorkDaysBy24Hours(WorkDayFixture.START_TIME(), WorkDayFixture.END_TIME());

		Assertions.assertEquals(21, days);
	}

}
