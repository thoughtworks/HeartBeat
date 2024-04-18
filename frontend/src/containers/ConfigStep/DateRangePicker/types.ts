import { SortedDateRangeType } from '@src/containers/ConfigStep/DateRangePicker/DateRangePickerGroup';
import { DateValidationError } from '@mui/x-date-pickers';

export interface IRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  index: number;
  key?: string | number;
  onError?: (type: string, error: DateValidationError, index: number) => void;
  onChange?: (data: { startDate: string | null; endDate: string | null }, index: number) => void;
  onRemove?: (index: number) => void;
  rangeList?: SortedDateRangeType[];
}
