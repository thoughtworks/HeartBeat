import { Radio, RadioGroup } from '@mui/material'
import { useState } from 'react'
import { CHINA_CALENDAR, DEFAULT_HELPER_TEXT, REGULAR_CALENDAR } from '@src/constants'
import { DateRangePicker } from '@src/components/Metrics/ConfigStep/DateRangePicker'
import { ConfigStepWrapper, ProjectNameInput, StyledFormControlLabel } from './style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { MetricsTypeCheckbox } from '@src/components/Metrics/ConfigStep/MetricsTypeCheckbox'
import {
  selectCalendarType,
  selectProjectName,
  selectWarningMessage,
  updateBoardVerifyState,
  updateCalendarType,
  updatePipelineToolVerifyState,
  updateProjectName,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice'
import { WarningNotification } from '@src/components/Common/WarningNotification'

const ConfigStep = () => {
  const dispatch = useAppDispatch()
  const projectName = useAppSelector(selectProjectName)
  const calendarType = useAppSelector(selectCalendarType)
  const warningMessage = useAppSelector(selectWarningMessage)

  const [isEmptyProjectName, setIsEmptyProjectName] = useState<boolean>(false)

  return (
    <ConfigStepWrapper>
      {warningMessage && <WarningNotification message={warningMessage} />}
      <ProjectNameInput
        required
        label='Project name'
        variant='standard'
        value={projectName}
        onFocus={(e) => {
          setIsEmptyProjectName(e.target.value === '')
        }}
        onChange={(e) => {
          dispatch(updateProjectName(e.target.value))
          setIsEmptyProjectName(e.target.value === '')
        }}
        error={isEmptyProjectName}
        helperText={isEmptyProjectName ? 'Project name is required' : DEFAULT_HELPER_TEXT}
      />
      <h3>Collection Date</h3>
      <RadioGroup
        value={calendarType}
        onChange={(e) => {
          dispatch(updateBoardVerifyState(false))
          dispatch(updatePipelineToolVerifyState(false))
          dispatch(updateSourceControlVerifyState(false))
          dispatch(updateCalendarType(e.target.value))
        }}
      >
        <StyledFormControlLabel value={REGULAR_CALENDAR} control={<Radio />} label={REGULAR_CALENDAR} />
        <StyledFormControlLabel value={CHINA_CALENDAR} control={<Radio />} label={CHINA_CALENDAR} />
      </RadioGroup>
      <DateRangePicker />
      <MetricsTypeCheckbox />
    </ConfigStepWrapper>
  )
}

export default ConfigStep
