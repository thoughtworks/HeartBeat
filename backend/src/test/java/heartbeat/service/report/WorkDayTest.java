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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkDayTest {

	@InjectMocks
	WorkDay workDay;

	@Mock
	HolidayFeignClient holidayFeignClient;

	@Test
	void shouldReturnDayIsHoliday() {
		List<HolidayDTO> holidayDTOList = List.of(
				HolidayDTO.builder().date("2023-01-01").name("元旦").isOffDay(true).build(),
				HolidayDTO.builder().date("2023-01-28").name("春节").isOffDay(false).build());

		long holidayTime = LocalDate.parse("2023-01-01", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();

		long workdayTime = LocalDate.parse("2023-01-28", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();

		when(holidayFeignClient.getHolidays(any()))
			.thenReturn(HolidaysResponseDTO.builder().days(holidayDTOList).build());

		workDay.changeConsiderHolidayMode(true);
		boolean resultWorkDay = workDay.verifyIfThisDayHoliday(holidayTime);
		boolean resultHoliday = workDay.verifyIfThisDayHoliday(workdayTime);

		Assertions.assertTrue(resultWorkDay);
		Assertions.assertFalse(resultHoliday);
	}

	@Test
	void shouldReturnDayIsHolidayWithoutChineseHoliday() {

		long holidayTime = LocalDate.parse("2023-01-01", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();

		long workdayTime = LocalDate.parse("2023-01-28", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();

		workDay.changeConsiderHolidayMode(false);
		boolean resultWorkDay = workDay.verifyIfThisDayHoliday(holidayTime);
		boolean resultHoliday = workDay.verifyIfThisDayHoliday(workdayTime);

		Assertions.assertTrue(resultWorkDay);
		Assertions.assertTrue(resultHoliday);
	}

	@Test
	void shouldReturnRightWorkDaysWhenCalculateWorkDaysBetween() {

		int result = workDay.calculateWorkDaysBetween(WorkDayFixture.START_TIME(), WorkDayFixture.END_TIME());
		int resultNewYear = workDay.calculateWorkDaysBetween(WorkDayFixture.START_TIME_NEW_YEAR(),
				WorkDayFixture.END_TIME_NEW_YEAR());

		Assertions.assertEquals(23, result);
		Assertions.assertEquals(22, resultNewYear);
	}

	@Test
	void shouldReturnRightWorkDaysWhenCalculateWorkDaysBy24Hours() {

		double days = workDay.calculateWorkDaysBy24Hours(WorkDayFixture.START_TIME(), WorkDayFixture.END_TIME());

		Assertions.assertEquals(23, days);
	}

}
