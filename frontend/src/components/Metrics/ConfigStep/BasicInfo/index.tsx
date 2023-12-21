import { Radio, RadioGroup } from '@mui/material'
import { useState } from 'react'
import { CALENDAR } from '@src/constants/resources'
import { DEFAULT_HELPER_TEXT } from '@src/constants/commons'
import { DateRangePicker } from '@src/components/Metrics/ConfigStep/DateRangePicker'
import { CollectionDateLabel, ProjectNameInput, StyledFormControlLabel } from './style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
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
import { ConfigSectionContainer } from '@src/components/Common/ConfigForms'
import { ConfigSelectionTitle } from '@src/components/Metrics/MetricsStep/style'
import { RequiredMetrics } from '@src/components/Metrics/ConfigStep/BasicInfo/RequiredMetrics'

const BasicInfo = () => {
  const dispatch = useAppDispatch()
  const projectName = useAppSelector(selectProjectName)
  const calendarType = useAppSelector(selectCalendarType)
  const warningMessage = useAppSelector(selectWarningMessage)
  const [isEmptyProjectName, setIsEmptyProjectName] = useState<boolean>(false)

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
            setIsEmptyProjectName(e.target.value === '')
          }}
          onChange={(e) => {
            dispatch(updateProjectName(e.target.value))
            setIsEmptyProjectName(e.target.value === '')
          }}
          error={isEmptyProjectName}
          helperText={isEmptyProjectName ? 'Project name is required' : DEFAULT_HELPER_TEXT}
        />
        <CollectionDateLabel>Collection Date</CollectionDateLabel>
        <RadioGroup
          value={calendarType}
          onChange={(e) => {
            dispatch(updateBoardVerifyState(false))
            dispatch(updatePipelineToolVerifyState(false))
            dispatch(updateSourceControlVerifyState(false))
            dispatch(updateCalendarType(e.target.value))
          }}
        >
          <StyledFormControlLabel value={CALENDAR.REGULAR} control={<Radio />} label={CALENDAR.REGULAR} />
          <StyledFormControlLabel value={CALENDAR.CHINA} control={<Radio />} label={CALENDAR.CHINA} />
        </RadioGroup>
        <DateRangePicker />
        <RequiredMetrics />
      </ConfigSectionContainer>
    </>
  )
}

export default BasicInfo
