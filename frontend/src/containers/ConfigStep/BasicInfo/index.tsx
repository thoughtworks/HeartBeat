import {
  selectCalendarType,
  selectProjectName,
  selectWarningMessage,
  updateCalendarType,
  updateProjectName,
} from '@src/context/config/configSlice';
import { CollectionDateLabel, ProjectNameInput, StyledFormControlLabel } from './style';
import { RequiredMetrics } from '@src/containers/ConfigStep/BasicInfo/RequiredMetrics';
import { DateRangePickerSection } from '@src/containers/ConfigStep/DateRangePicker';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import { ConfigSectionContainer } from '@src/components/Common/ConfigForms';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { ConfigSelectionTitle } from '@src/containers/MetricsStep/style';
import { DEFAULT_HELPER_TEXT } from '@src/constants/commons';
import { CALENDAR } from '@src/constants/resources';
import { Radio, RadioGroup } from '@mui/material';
import { useState } from 'react';

const BasicInfo = () => {
  const dispatch = useAppDispatch();
  const projectName = useAppSelector(selectProjectName);
  const calendarType = useAppSelector(selectCalendarType);
  const warningMessage = useAppSelector(selectWarningMessage);
  const [isEmptyProjectName, setIsEmptyProjectName] = useState<boolean>(false);

  return (
    <>
      {warningMessage && <WarningNotification message={warningMessage} />}
      <ConfigSectionContainer aria-label='Basic information'>
        <ConfigSelectionTitle>Basic information</ConfigSelectionTitle>
        <ProjectNameInput
          required
          label='Project name'
          variant='standard'
          value={projectName}
          onFocus={(e) => {
            setIsEmptyProjectName(e.target.value === '');
          }}
          onChange={(e) => {
            dispatch(updateProjectName(e.target.value));
            setIsEmptyProjectName(e.target.value === '');
          }}
          error={isEmptyProjectName}
          helperText={isEmptyProjectName ? 'Project name is required' : DEFAULT_HELPER_TEXT}
        />
        <CollectionDateLabel>Collection Date</CollectionDateLabel>
        <RadioGroup
          value={calendarType}
          onChange={(e) => {
            dispatch(updateCalendarType(e.target.value));
          }}
        >
          <StyledFormControlLabel value={CALENDAR.REGULAR} control={<Radio />} label={CALENDAR.REGULAR} />
          <StyledFormControlLabel value={CALENDAR.CHINA} control={<Radio />} label={CALENDAR.CHINA} />
        </RadioGroup>
        <DateRangePickerSection />
        <RequiredMetrics />
      </ConfigSectionContainer>
    </>
  );
};

export default BasicInfo;
