package heartbeat.service.report;

import heartbeat.client.dto.board.jira.HolidayDTO;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class WorkDayFixture {

	public static List<HolidayDTO> HOLIDAYS_DATA() {
		return List.of(HolidayDTO.builder().date("2020-01-01").name("元旦").isOffDay(true).build(),
				HolidayDTO.builder().date("2020-01-24").name("春节").isOffDay(true).build(),
				HolidayDTO.builder().date("2020-01-25").name("春节").isOffDay(true).build());
	}

	public static long START_TIME() {
		return LocalDate.parse("2020-01-01", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();
	}

	public static long END_TIME() {
		return LocalDate.parse("2020-02-01", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();
	}

	public static long START_TIME_NEW_YEAR() {
		return LocalDate.parse("2021-01-01", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();
	}

	public static long END_TIME_NEW_YEAR() {
		return LocalDate.parse("2021-02-01", DateTimeFormatter.ISO_DATE)
			.atStartOfDay(ZoneOffset.UTC)
			.toInstant()
			.toEpochMilli();
	}

}
