import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import React, { useState } from 'react'
import { CHINA_CALENDAR, REGULAR_CALENDAR, STEPS } from '@src/constants'
import { DateRangePicker } from '@src/components/metrics/ConfigStep/DateRangePicker'
import { BackButton, ButtonGroup, ExportButton, NextButton, ProjectNameInput } from './style'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { backStep, nextStep, selectStep } from '@src/features/stepper/StepperSlice'
import { Board } from '@src/components/metrics/ConfigStep/Board'
import { MetricsTypeCheckbox } from '@src/components/metrics/ConfigStep/MetricsTypeCheckbox'

export const ConfigStep = () => {
  const dispatch = useAppDispatch()
  const activeStep = useAppSelector(selectStep)

  const [projectName, setProjectName] = useState<string>('')
  const [isEmptyProjectName, setIsEmptyProjectName] = useState<boolean>(false)

  const handleNext = () => {
    dispatch(nextStep())
  }

  const handleBack = () => {
    dispatch(backStep())
  }

  return (
    <>
      <ProjectNameInput
        required
        label='Project Name'
        variant='standard'
        value={projectName}
        onChange={(e) => {
          setProjectName(e.target.value)
          setIsEmptyProjectName(e.target.value === '')
        }}
        error={isEmptyProjectName}
        helperText={isEmptyProjectName ? 'Project Name is required' : ''}
      />
      <h3>Collection Date</h3>
      <RadioGroup defaultValue={REGULAR_CALENDAR}>
        <FormControlLabel value={REGULAR_CALENDAR} control={<Radio />} label={REGULAR_CALENDAR} />
        <FormControlLabel value={CHINA_CALENDAR} control={<Radio />} label={CHINA_CALENDAR} />
      </RadioGroup>
      <DateRangePicker />
      <MetricsTypeCheckbox />
      <Board />
      <ButtonGroup>
        <BackButton onClick={handleBack}>Back</BackButton>
        {activeStep === STEPS.length - 1 ? (
          <ExportButton>Export board data</ExportButton>
        ) : (
          <NextButton onClick={handleNext}>Next</NextButton>
        )}
      </ButtonGroup>
    </>
  )
}
