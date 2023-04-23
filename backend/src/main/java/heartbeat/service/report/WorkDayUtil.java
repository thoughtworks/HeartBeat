package heartbeat.service.report;

import heartbeat.client.HolidayFeignClient;
import heartbeat.client.dto.HolidayDTO;
import lombok.RequiredArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
public class WorkDayUtil {

	private static final long ONE_DAY = 1000 * 60 * 60 * 24;

	private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

	private final HolidayFeignClient holidayFeignClient;

	public Map<String, Boolean> loadHolidayList(String year) {
		List<HolidayDTO> tempHolidayList = holidayFeignClient.getHoliday(year).getDays();
		Map<String, Boolean> holidayMap = new HashMap<>();
		for (HolidayDTO tempHoliday : tempHolidayList) {
			holidayMap.put(tempHoliday.getDate(), tempHoliday.getIsOffDay());
		}
		return holidayMap;
	}

	public boolean verifyIfThisDayHoliday(long time) {
		String dateString = convertTimeToDateString(time);
		int year = LocalDate.parse(dateString, DATE_FORMATTER).getYear();
		Map<String, Boolean> holidayMap = loadHolidayList(String.valueOf(year));
		if (holidayMap.containsKey(dateString)) {
			return holidayMap.get(dateString);
		}
		LocalDate date = LocalDate.ofEpochDay(time / ONE_DAY);
		return date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY;
	}

	public int calculateWorkDaysBetween(long startTime, long endTime) {
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

	public double calculateWorkDaysBy24Hours(long startTime, long endTime) {
		startTime = getNextNearestWorkingTime(startTime);
		endTime = getNextNearestWorkingTime(endTime);
		Date startDate = new Date(startTime);
		startDate.setHours(0);
		Date endDate = new Date(endTime);
		endDate.setHours(0);
		long gapDaysTime = endDate.getTime() - startDate.getTime();
		long gapWorkingDaysTime = (calculateWorkDaysBetween(startTime, endTime) - 1) * ONE_DAY;
		return Double.parseDouble(String.valueOf((endTime - startTime - gapDaysTime + gapWorkingDaysTime) / ONE_DAY));
	}

	private static String convertTimeToDateString(long time) {
		LocalDate date = LocalDate.ofEpochDay(time / ONE_DAY);
		return date.format(DATE_FORMATTER);
	}

	private long getNextNearestWorkingTime(long time) {
		while (verifyIfThisDayHoliday(time)) {
			time += ONE_DAY;
		}
		return time;
	}

}
