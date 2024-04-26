import { DateValidationError } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export type SortedDateRangeType = {
  startDate: string | null;
  endDate: string | null;
  sortIndex: number;
  startDateError: DateValidationError | string | null;
  endDateError: DateValidationError | string | null;
};

export interface IRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  index: number;
  key?: string | number;
  onError?: (type: string, error: DateValidationError | string, index: number) => void;
  onChange?: (data: { startDate: string | null; endDate: string | null }, index: number) => void;
  onRemove?: (index: number) => void;
  rangeList?: SortedDateRangeType[];
}

export enum SortType {
  DESCENDING = 'DESCENDING',
  ASCENDING = 'ASCENDING',
  DEFAULT = 'DEFAULT',
}

export const sortFn = {
  DEFAULT: ({ sortIndex }: SortedDateRangeType) => sortIndex,
  DESCENDING: ({ startDate }: SortedDateRangeType) => -dayjs(startDate).unix(),
  ASCENDING: ({ startDate }: SortedDateRangeType) => dayjs(startDate).unix(),
};
export type Props = {
  sortType: SortType;
  onChange?: (data: SortedDateRangeType[]) => void;
  onError?: (data: SortedDateRangeType[]) => void;
};
