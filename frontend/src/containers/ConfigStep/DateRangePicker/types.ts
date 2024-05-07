import { DateValidationError } from '@mui/x-date-pickers';
import { Nullable } from '@src/utils/types';
import dayjs from 'dayjs';

export type SortedDateRangeType = {
  startDate: string | null;
  endDate: string | null;
  sortIndex: number;
  startDateError: DateValidationError | string | null;
  endDateError: DateValidationError | string | null;
};

export interface IRangeOnChangeData {
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  startDateError: Nullable<string>;
  endDateError: Nullable<string>;
}

export interface IRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  index: number;
  key?: string | number;
  onChange: (data: IRangeOnChangeData, index: number) => void;
  onRemove: (index: number) => void;
  rangeList: SortedDateRangeType[];
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
export type TProps = {
  onChange?: (data: SortedDateRangeType[]) => void;
  onError?: (data: SortedDateRangeType[]) => void;
};
