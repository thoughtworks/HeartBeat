import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { useState } from 'react'
import { CHINA_CALENDAR, REGULAR_CALENDAR } from '@src/constants'
import { DateRangePicker } from '@src/components/Metrics/ConfigStep/DateRangePicker'
import { ConfigStepWrapper, ProjectNameInput } from './style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { MetricsTypeCheckbox } from '@src/components/Metrics/ConfigStep/MetricsTypeCheckbox'
import {
  selectCalendarType,
  selectProjectName,
  updateBoardVerifyState,
  updateCalendarType,
  updateProjectName,
} from '@src/context/config/configSlice'

export const ConfigStep = () => {
  const dispatch = useAppDispatch()
  const projectName = useAppSelector(selectProjectName)
  const calendarType = useAppSelector(selectCalendarType)

  const [isEmptyProjectName, setIsEmptyProjectName] = useState<boolean>(false)

  return (
    <ConfigStepWrapper>
      <ProjectNameInput
        required
        label='Project Name'
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
        helperText={isEmptyProjectName ? 'Project Name is required' : ''}
      />
      <h3>Collection Date</h3>
      <RadioGroup
        value={calendarType}
        onChange={(e) => {
          dispatch(updateBoardVerifyState(false))
          dispatch(updateCalendarType(e.target.value))
        }}
      >
        <FormControlLabel value={REGULAR_CALENDAR} control={<Radio />} label={REGULAR_CALENDAR} />
        <FormControlLabel value={CHINA_CALENDAR} control={<Radio />} label={CHINA_CALENDAR} />
      </RadioGroup>
      <DateRangePicker />
      <MetricsTypeCheckbox />
    </ConfigStepWrapper>
  )
}
