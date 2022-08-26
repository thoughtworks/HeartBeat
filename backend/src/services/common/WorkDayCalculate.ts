import axios from "axios";

export const ONE_DAY = 1000 * 60 * 60 * 24;

export class WorkDayCalculate {
  static holidayMap = new Map<string, boolean>();
  static httpClient = axios.create({
    baseURL: "https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/",
  });
}

export async function loadHolidayList(year: number): Promise<void> {
  const response = await WorkDayCalculate.httpClient.get(`${year}.json`);

  const tempHolidayList: Holiday[] = response.data.days;
  tempHolidayList.forEach((element) => {
    WorkDayCalculate.holidayMap.set(element.date, element.isOffDay);
  });
}

export async function changeConsiderHolidayMode(
  considerHoliday: boolean = true
): Promise<void> {
  if (!considerHoliday) {
    WorkDayCalculate.holidayMap = new Map<string, boolean>();
  } else if (WorkDayCalculate.holidayMap.size == 0) {
    await loadHolidayList(new Date().getFullYear());
  }
}

function convertTimeToDateString(time: number): string {
  const date = new Date(time);
  return (
    date.getFullYear().toString() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2)
  );
}

export function verifyIfThisDayHoliday(time: number): boolean {
  const dateString = convertTimeToDateString(time);
  if (WorkDayCalculate.holidayMap.has(dateString))
    return WorkDayCalculate.holidayMap.get(dateString) as boolean;

  return new Date(time).getDay() == 6 || new Date(time).getDay() == 0;
}

export function calculateWorkDaysBetween(
  startTime: number,
  endTime: number
): number {
  const startDate = new Date(startTime).setHours(0, 0, 0, 0);
  const endDate = new Date(endTime).setHours(0, 0, 0, 0);
  let days = 0;
  for (let tempDate = startDate; tempDate <= endDate; tempDate += ONE_DAY)
    if (!verifyIfThisDayHoliday(tempDate)) {
      days++;
    }
  return days;
}

function returnNextNearestWorkingTime(time: number): number {
  if (verifyIfThisDayHoliday(time)) {
    return returnNextNearestWorkingTime(
      new Date(time + ONE_DAY).setHours(0, 0, 0, 0)
    );
  }
  return time;
}

export function calculateWorkDaysBy24Hours(
  startTime: number,
  endTime: number
): number {
  startTime = returnNextNearestWorkingTime(startTime);
  endTime = returnNextNearestWorkingTime(endTime);
  const startDate = new Date(startTime).setHours(0, 0, 0, 0);
  const endDate = new Date(endTime).setHours(0, 0, 0, 0);
  const gapDaysTime = endDate - startDate;
  const gapWorkingDaysTime =
    (calculateWorkDaysBetween(startTime, endTime) - 1) * ONE_DAY;
  return +(
    (endTime - startTime - gapDaysTime + gapWorkingDaysTime) /
    ONE_DAY
  ).toFixed(2);
}

export class Holiday {
  name: string;
  date: string;
  isOffDay: boolean;

  constructor(name: string, date: string, isOffDay: boolean) {
    this.name = name;
    this.date = date;
    this.isOffDay = isOffDay;
  }
}
