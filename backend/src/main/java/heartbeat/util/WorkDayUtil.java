package heartbeat.util;

import heartbeat.client.HolidayFeignClient;
import heartbeat.client.dto.HolidayDTO;

import java.time.Year;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.DayOfWeek;

public class WorkDayUtil {

	private static final long ONE_DAY = 1000 * 60 * 60 * 24;

	private static Map<String, Boolean> holidayMap = new HashMap<>();

	private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

	private static HolidayFeignClient holidayFeignClient;

	public static void loadHolidayList(String year) {
		List<HolidayDTO> tempHolidayList = holidayFeignClient.getHoliday(year);
		for (HolidayDTO tempHoliday : tempHolidayList) {
			holidayMap.put(tempHoliday.getDate(), tempHoliday.getIsOffDay());
		}
	}

	public static void changeConsiderHolidayMode(boolean considerHoliday) {
		if (!considerHoliday) {
			holidayMap = new HashMap<>();
		}
		else if (holidayMap.size() == 0) {
			loadHolidayList(String.valueOf(Year.now().getValue()));
		}
	}

	private static String convertTimeToDateString(long time) {
		LocalDate date = LocalDate.ofEpochDay(time / ONE_DAY);
		return date.format(DATE_FORMATTER);
	}

	public static boolean verifyIfThisDayHoliday(long time) {
		String dateString = convertTimeToDateString(time);
		if (holidayMap.containsKey(dateString)) {
			return holidayMap.get(dateString);
		}
		LocalDate date = LocalDate.ofEpochDay(time / ONE_DAY);
		return date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY;
	}

	public static int calculateWorkDaysBetween(long startTime, long endTime) {
		long startDate = LocalDate.ofEpochDay(startTime / ONE_DAY).toEpochDay() * ONE_DAY;
		long endDate = LocalDate.ofEpochDay(endTime / ONE_DAY).toEpochDay() * ONE_DAY;
		int days = 0;
		for (long tempDate = startDate; tempDate <= endDate; tempDate += ONE_DAY) {
			if (!verifyIfThisDayHoliday(tempDate)) {
				days++;
			}
		}
		return days;
	}

	private static long returnNextNearestWorkingTime(long time) {
		while (verifyIfThisDayHoliday(time)) {
			time += ONE_DAY;
		}
		return time;
	}

	public static double calculateWorkDaysBy24Hours(long startTime, long endTime) {

		startTime = returnNextNearestWorkingTime(startTime);

		endTime = returnNextNearestWorkingTime(endTime);

		Date startDate = new Date(startTime);
		startDate.setHours(0);
		Date endDate = new Date(endTime);
		endDate.setHours(0);
		long gapDaysTime = endDate.getTime() - startDate.getTime();
		long gapWorkingDaysTime = (calculateWorkDaysBetween(startTime, endTime) - 1) * ONE_DAY;
		return Double
			.parseDouble(String.format("%.2f", (endTime - startTime - gapDaysTime + gapWorkingDaysTime) / ONE_DAY));
	}

}
