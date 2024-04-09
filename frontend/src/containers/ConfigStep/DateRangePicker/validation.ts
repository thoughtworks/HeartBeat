import dayjsSameOrBeforePlugin from 'dayjs/plugin/isSameOrBefore';
import dayjsSameOrAfterPlugin from 'dayjs/plugin/isSameOrAfter';
import { TDateRange } from '@src/context/config/configSlice';
import dayjs, { Dayjs } from 'dayjs';

dayjs.extend(dayjsSameOrBeforePlugin);
dayjs.extend(dayjsSameOrAfterPlugin);

export const calculateLastAvailableDate = (date: Dayjs, coveredRange: TDateRange) => {
  let lastAvailableDate = dayjs(new Date()).startOf('date');
  let minimumDiffDays = lastAvailableDate.diff(date, 'days');

  for (const { startDate } of coveredRange) {
    const startDateDayjsObj = dayjs(startDate);
    if (startDateDayjsObj.isValid()) {
      const diffDays = startDateDayjsObj.diff(date, 'days');
      if (startDateDayjsObj.isSameOrAfter(date) && diffDays <= minimumDiffDays) {
        lastAvailableDate = startDateDayjsObj.subtract(1, 'day');
        minimumDiffDays = diffDays;
      }
    }
  }

  return lastAvailableDate;
};

export const isDateDisabled = (coveredRange: TDateRange, date: Dayjs) =>
  coveredRange.some(
    ({ startDate, endDate }) => date.isSameOrAfter(startDate, 'date') && date.isSameOrBefore(endDate, 'date'),
  );
