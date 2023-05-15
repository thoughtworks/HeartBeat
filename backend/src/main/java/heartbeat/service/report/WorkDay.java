package heartbeat.service.report;

import heartbeat.client.HolidayFeignClient;
import heartbeat.client.dto.board.jira.HolidayDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@Component
@RequiredArgsConstructor
public class WorkDay {

	private static final long ONE_DAY = 1000 * 60 * 60 * 24;

	private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

	private final HolidayFeignClient holidayFeignClient;

	private Map<String, Boolean> holidayMap = new HashMap<>();

	private void loadHolidayList(String year) {
		log.info("Start to get chinese holiday by year: {}", year);
		List<HolidayDTO> tempHolidayList = holidayFeignClient.getHolidays(year).getDays();
		log.info("Successfully get holiday list:{}", tempHolidayList);

		for (HolidayDTO tempHoliday : tempHolidayList) {
			holidayMap.put(tempHoliday.getDate(), tempHoliday.getIsOffDay());
		}
	}

	private void checkHolidayList(String year) {
		if (holidayMap.size() == 0) {
			loadHolidayList(year);
		}
		else if (!isYearExisted(year)) {
			loadHolidayList(year);
		}
	}

	private boolean isYearExisted(String year) {
		boolean hasYear = false;
		for (String dateString : holidayMap.keySet()) {
			hasYear = dateString.startsWith(year);
		}
		return hasYear;
	}

	public boolean verifyIfThisDayHoliday(long time) {
		String dateString = convertTimeToDateString(time);
		checkHolidayList(String.valueOf(LocalDate.parse(dateString, DATE_FORMATTER).getYear()));
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
		long realStartTime = getNextNearestWorkingTime(startTime);
		long realEndTime = getNextNearestWorkingTime(endTime);
		Date startDate = new Date(realStartTime);
		startDate.setHours(0);
		Date endDate = new Date(realEndTime);
		endDate.setHours(0);
		long gapDaysTime = endDate.getTime() - startDate.getTime();
		long gapWorkingDaysTime = (calculateWorkDaysBetween(realStartTime, realEndTime) - 1) * ONE_DAY;
		return Double
			.parseDouble(String.valueOf((realEndTime - realStartTime - gapDaysTime + gapWorkingDaysTime) / ONE_DAY));
	}

	private static String convertTimeToDateString(long time) {
		LocalDate date = LocalDate.ofEpochDay(time / ONE_DAY);
		return date.format(DATE_FORMATTER);
	}

	private long getNextNearestWorkingTime(long time) {
		long nextWorkingTime = time;
		while (verifyIfThisDayHoliday(nextWorkingTime)) {
			nextWorkingTime += ONE_DAY;
		}
		return nextWorkingTime;
	}

}
