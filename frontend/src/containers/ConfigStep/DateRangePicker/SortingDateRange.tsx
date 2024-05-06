import {
  AscendingIcon,
  DescendingIcon,
  SortingButton,
  SortingButtoningContainer,
  SortingTextButton,
} from '@src/containers/ConfigStep/DateRangePicker/style';
import { selectDateRangeSortType, updateDateRangeSortType } from '@src/context/config/configSlice';
import { SortType } from '@src/containers/ConfigStep/DateRangePicker/types';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { SORTING_DATE_RANGE_TEXT } from '@src/constants/resources';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Box } from '@mui/material';

type Props = {
  disabled: boolean;
};

export const SortingDateRange = ({ disabled }: Props) => {
  const dispatch = useAppDispatch();
  const currentSortType = useAppSelector(selectDateRangeSortType);

  const handleChangeSort = () => {
    const sortTypes = Object.values(SortType);
    const totalSortTypes = sortTypes.length;
    const currentIndex = sortTypes.indexOf(currentSortType);
    const newIndex = (currentIndex + 1) % totalSortTypes;
    const newSortType = sortTypes[newIndex];

    dispatch(updateDateRangeSortType(newSortType));
  };

  return (
    <Box aria-label='Sorting date range'>
      <SortingButtoningContainer>
        <SortingTextButton disableRipple>{SORTING_DATE_RANGE_TEXT[currentSortType]}</SortingTextButton>
        <SortingButton aria-label='sort button' onClick={handleChangeSort} disabled={disabled}>
          {currentSortType === SortType.ASCENDING ? (
            <AscendingIcon disabled={disabled} />
          ) : (
            <ArrowDropUp fontSize='inherit' />
          )}
          {currentSortType === SortType.DESCENDING ? (
            <DescendingIcon disabled={disabled} />
          ) : (
            <ArrowDropDown fontSize='inherit' />
          )}
        </SortingButton>
      </SortingButtoningContainer>
    </Box>
  );
};
