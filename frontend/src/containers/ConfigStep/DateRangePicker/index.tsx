import { DateRangePickerGroup } from '@src/containers/ConfigStep/DateRangePicker/DateRangePickerGroup';
import { SortingDateRange } from '@src/containers/ConfigStep/DateRangePicker/SortingDateRange';
import { SortedDateRangeType } from '@src/containers/ConfigStep/DateRangePicker/types';
import SectionTitleWithTooltip from '@src/components/Common/SectionTitleWithTooltip';
import { TitleContainer } from '@src/containers/ConfigStep/DateRangePicker/style';
import { selectDateRange } from '@src/context/config/configSlice';
import { TIME_RANGE_TITLE, TIPS } from '@src/constants/resources';
import { useAppSelector } from '@src/hooks/useAppDispatch';
import { useState } from 'react';

export const DateRangePickerSection = () => {
  const dateRangeGroup = useAppSelector(selectDateRange);
  const [hasError, setHasError] = useState(false);
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
        {dateRangeGroup.length > 1 && <SortingDateRange disabled={hasError} />}
      </TitleContainer>
      <DateRangePickerGroup onError={handleError} />
    </div>
  );
};
