import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import React, { useState } from 'react'
import { CHINA_CALENDAR, REGULAR_CALENDAR, STEPS, REQUIRED_DATAS } from '@src/constants'
import { DateRangePicker } from '@src/components/metrics/ConfigStep/DateRangePicker'
import { BackButton, ButtonGroup, ConfigStepWrapper, ExportButton, NextButton, ProjectNameInput } from './style'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { backStep, nextStep, selectStep } from '@src/features/stepper/StepperSlice'
import { Board } from '@src/components/metrics/ConfigStep/Board'
import { MetricsTypeCheckbox } from '@src/components/metrics/ConfigStep/MetricsTypeCheckbox'
import { changeBoardVerifyState } from '@src/features/board/boardSlice'

export const ConfigStep = () => {
  const dispatch = useAppDispatch()
  const activeStep = useAppSelector(selectStep)

  const [projectName, setProjectName] = useState<string>('')
  const [isEmptyProjectName, setIsEmptyProjectName] = useState<boolean>(false)
  const [isShowBoard, setIsShowBoard] = useState(false)

  const handleNext = () => {
    dispatch(nextStep())
  }

  const handleBack = () => {
    dispatch(backStep())
  }

  const handleRequireData = (requireData: string[]) => {
    setIsShowBoard(
      requireData.includes(REQUIRED_DATAS[0]) ||
        requireData.includes(REQUIRED_DATAS[1]) ||
        requireData.includes(REQUIRED_DATAS[2])
    )
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
          setProjectName(e.target.value)
          setIsEmptyProjectName(e.target.value === '')
        }}
        error={isEmptyProjectName}
        helperText={isEmptyProjectName ? 'Project Name is required' : ''}
      />
      <h3>Collection Date</h3>
      <RadioGroup defaultValue={REGULAR_CALENDAR} onChange={() => dispatch(changeBoardVerifyState(false))}>
        <FormControlLabel value={REGULAR_CALENDAR} control={<Radio />} label={REGULAR_CALENDAR} />
        <FormControlLabel value={CHINA_CALENDAR} control={<Radio />} label={CHINA_CALENDAR} />
      </RadioGroup>
      <DateRangePicker />
      <MetricsTypeCheckbox onHandleRequireData={(value: string[]) => handleRequireData(value)} />
      {isShowBoard && <Board />}
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
