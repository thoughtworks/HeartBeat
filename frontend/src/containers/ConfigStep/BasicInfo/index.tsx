import { selectWarningMessage, updateCalendarType, updateProjectName } from '@src/context/config/configSlice';
import { CollectionDateLabel, ProjectNameInput, StyledFormControlLabel } from './style';
import { RequiredMetrics } from '@src/containers/ConfigStep/BasicInfo/RequiredMetrics';
import { DateRangePickerSection } from '@src/containers/ConfigStep/DateRangePicker';
import { BASIC_INFO_ERROR_MESSAGE } from '@src/containers/ConfigStep/Form/literal';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import { ConfigSectionContainer } from '@src/components/Common/ConfigForms';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { ConfigSelectionTitle } from '@src/containers/MetricsStep/style';
import { Controller, useFormContext } from 'react-hook-form';
import { CALENDAR } from '@src/constants/resources';
import { Radio, RadioGroup } from '@mui/material';

const BasicInfo = () => {
  const dispatch = useAppDispatch();
  const warningMessage = useAppSelector(selectWarningMessage);
  const { setError, control } = useFormContext();

  return (
    <>
      {warningMessage && <WarningNotification message={warningMessage} />}
      <ConfigSectionContainer aria-label='Basic information'>
        <ConfigSelectionTitle>Basic information</ConfigSelectionTitle>
        <Controller
          name={'projectName'}
          control={control}
          render={({ field, fieldState }) => (
            <ProjectNameInput
              required
              label='Project name'
              variant='standard'
              {...field}
              onChange={(e) => {
                dispatch(updateProjectName(e.target.value));
                field.onChange(e.target.value);
              }}
              onFocus={() => {
                if (field.value === '') {
                  setError('projectName', { message: BASIC_INFO_ERROR_MESSAGE.projectName.required });
                }
              }}
              error={fieldState.invalid}
              helperText={fieldState.error?.message || ''}
            />
          )}
        />

        <CollectionDateLabel>Collection Date</CollectionDateLabel>
        <Controller
          name={'calendarType'}
          control={control}
          render={({ field }) => {
            return (
              <RadioGroup
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  dispatch(updateCalendarType(e.target.value));
                }}
              >
                <StyledFormControlLabel value={CALENDAR.REGULAR} control={<Radio />} label={CALENDAR.REGULAR} />
                <StyledFormControlLabel value={CALENDAR.CHINA} control={<Radio />} label={CALENDAR.CHINA} />
              </RadioGroup>
            );
          }}
        />
        <DateRangePickerSection />
        <RequiredMetrics />
      </ConfigSectionContainer>
    </>
  );
};

export default BasicInfo;
