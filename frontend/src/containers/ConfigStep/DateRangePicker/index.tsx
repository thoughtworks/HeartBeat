import { DateRangePickerGroup, SortType } from '@src/containers/ConfigStep/DateRangePicker/DateRangePickerGroup';
import { SortedDateRangeType } from '@src/containers/ConfigStep/DateRangePicker/DateRangePickerGroup';
import { SortingDateRange } from '@src/containers/ConfigStep/DateRangePicker/SortingDateRange';
import { selectDateRange, selectDateRangeSortType } from '@src/context/config/configSlice';
import SectionTitleWithTooltip from '@src/components/Common/SectionTitleWithTooltip';
import { TitleContainer } from '@src/containers/ConfigStep/DateRangePicker/style';
import { TIME_RANGE_TITLE, TIPS } from '@src/constants/resources';
import { useAppSelector } from '@src/hooks/useAppDispatch';
import { useMemo, useState } from 'react';

export const DateRangePickerSection = () => {
  const dateRangeGroup = useAppSelector(selectDateRange);
  const dateRangeGroupSortType = useAppSelector(selectDateRangeSortType);
  const [sortType, setSortType] = useState<SortType>(
    dateRangeGroupSortType ? dateRangeGroupSortType : SortType.DEFAULT,
  );

  const [hasError, setHasError] = useState(false);
  const isDateRangeValid = useMemo(() => {
    return dateRangeGroup.every((dateRange) => {
      return dateRange.startDate && dateRange.endDate;
    });
  }, [dateRangeGroup]);

  const handleSortTypeChange = (type: SortType) => {
    setSortType(type);
  };

  const handleError = (err: SortedDateRangeType[]) => {
    setHasError(!!err.length);
  };

  return (
    <div aria-label='Time range section'>
      <TitleContainer>
        <SectionTitleWithTooltip
          title={TIME_RANGE_TITLE}
          tooltipText={TIPS.TIME_RANGE_PICKER}
          titleStyle={{
            margin: '1rem 0',
          }}
        />
        {dateRangeGroup.length > 1 && isDateRangeValid && !hasError && (
          <SortingDateRange onChange={handleSortTypeChange} sortType={sortType} />
        )}
      </TitleContainer>
      <DateRangePickerGroup sortType={sortType} onError={handleError} />
    </div>
  );
};
