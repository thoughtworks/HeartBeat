import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import React, { useState } from 'react'
import { CHINA_CALENDAR, REGULAR_CALENDAR, STEPS } from '@src/constants'
import { DateRangePicker } from '@src/components/Metrics/ConfigStep/DateRangePicker'
import { BackButton, ButtonGroup, ConfigStepWrapper, ExportButton, NextButton, ProjectNameInput } from './style'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { backStep, nextStep, selectStep } from '@src/features/stepper/StepperSlice'
import { MetricsTypeCheckbox } from '@src/components/Metrics/ConfigStep/MetricsTypeCheckbox'
import { changeBoardVerifyState } from '@src/features/board/boardSlice'
import {
  selectCalendarType,
  selectProjectName,
  updateCalendarType,
  updateProjectName,
} from '@src/features/config/configSlice'

export const ConfigStep = () => {
  const dispatch = useAppDispatch()
  const activeStep = useAppSelector(selectStep)
  const projectName = useAppSelector(selectProjectName)
  const calendarType = useAppSelector(selectCalendarType)

  const [isEmptyProjectName, setIsEmptyProjectName] = useState<boolean>(false)

  const handleNext = () => {
    dispatch(nextStep())
  }

  const handleBack = () => {
    dispatch(backStep())
  }

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
          dispatch(changeBoardVerifyState(false))
          dispatch(updateCalendarType(e.target.value))
        }}
      >
        <FormControlLabel value={REGULAR_CALENDAR} control={<Radio />} label={REGULAR_CALENDAR} />
        <FormControlLabel value={CHINA_CALENDAR} control={<Radio />} label={CHINA_CALENDAR} />
      </RadioGroup>
      <DateRangePicker />
      <MetricsTypeCheckbox />
      <ButtonGroup>
        <BackButton onClick={handleBack}>Back</BackButton>
        {activeStep === STEPS.length - 1 ? (
          <ExportButton>Export board data</ExportButton>
        ) : (
          <NextButton onClick={handleNext}>Next</NextButton>
        )}
      </ButtonGroup>
    </ConfigStepWrapper>
  )
}
