import React, { useCallback } from 'react'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import FlagCard from '@src/components/Metrics/MetricsStep/CycleTime/FlagCard'
import { FormSelectPart } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelectPart'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import {
  saveCycleTimeSettings,
  saveDoneColumn,
  selectCycleTimeWarningMessage,
  selectMetricsContent,
} from '@src/context/Metrics/metricsSlice'
import { useAppSelector } from '@src/hooks'
import { WarningNotification } from '@src/components/Common/WarningNotification'
import { DONE, TIPS } from '@src/constants/resources'
import {
  CycleTimeContainer,
  StyledTooltip,
  TitleAndTooltipContainer,
  TooltipContainer,
} from '@src/components/Metrics/MetricsStep/CycleTime/style'
import { IconButton } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

interface cycleTimeProps {
  title: string
}

export const CycleTime = ({ title }: cycleTimeProps) => {
  const dispatch = useAppDispatch()
  const { cycleTimeSettings } = useAppSelector(selectMetricsContent)
  const warningMessage = useAppSelector(selectCycleTimeWarningMessage)

  const resetRealDoneColumn = useCallback(
    (name: string, value: string) => {
      const optionNamesWithDone = cycleTimeSettings.filter((item) => item.value === DONE).map((item) => item.name)

      if (value === DONE) {
        dispatch(saveDoneColumn([]))
      }

      if (optionNamesWithDone.includes(name)) {
        dispatch(saveDoneColumn([]))
      }
    },
    [cycleTimeSettings, dispatch]
  )

  const saveCycleTimeOptions = useCallback(
    (name: string, value: string) => {
      const newCycleTimeSettings = cycleTimeSettings.map((item) =>
        item.name === name
          ? {
              ...item,
              value,
            }
          : item
      )

      resetRealDoneColumn(name, value)
      dispatch(saveCycleTimeSettings(newCycleTimeSettings))
    },
    [cycleTimeSettings, dispatch, resetRealDoneColumn]
  )

  return (
    <div aria-label='Cycle time settings section'>
      <TitleAndTooltipContainer>
        <MetricsSettingTitle title={title} />
        <TooltipContainer data-test-id={'tooltip'}>
          <StyledTooltip title={TIPS.CYCLE_TIME}>
            <IconButton aria-label='info'>
              <InfoOutlinedIcon />
            </IconButton>
          </StyledTooltip>
        </TooltipContainer>
      </TitleAndTooltipContainer>
      <CycleTimeContainer>
        {warningMessage && <WarningNotification message={warningMessage} />}
        <FormSelectPart selectedOptions={cycleTimeSettings} saveCycleTimeOptions={saveCycleTimeOptions} />
        <FlagCard />
      </CycleTimeContainer>
    </div>
  )
}
