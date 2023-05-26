import React, { useEffect, useState } from 'react'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import FlagCard from '@src/components/Metrics/MetricsStep/CycleTime/FlagCard'
import { FormSelectPart } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelectPart'
import { ErrorDone } from '@src/components/Metrics/MetricsStep/CycleTime/style'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import {
  saveCycleTimeSettings,
  selectCycleTimeWarningMessage,
  selectMetricsContent,
  saveDoneColumn,
} from '@src/context/Metrics/metricsSlice'
import { useAppSelector } from '@src/hooks'
import { ErrorNotificationAutoDismiss } from '@src/components/Common/ErrorNotificationAutoDismiss'

interface cycleTimeProps {
  title: string
}

export const CycleTime = ({ title }: cycleTimeProps) => {
  const dispatch = useAppDispatch()
  const [isError, setIsError] = useState(false)
  const { cycleTimeSettings } = useAppSelector(selectMetricsContent)
  const warningMessage = useAppSelector(selectCycleTimeWarningMessage)
  const [cycleTimeOptions, setCycleTimeOptions] = useState(cycleTimeSettings)

  const saveCycleTimeOptions = (name: string, value: string) => {
    setCycleTimeOptions(
      cycleTimeOptions.map((item) => {
        if (item.name === name) {
          item = JSON.parse(JSON.stringify(item))
          item.value = value
        }
        return item
      })
    )
    dispatch(saveDoneColumn([]))
  }

  useEffect(() => {
    setIsError(cycleTimeOptions.filter((item) => item.value === 'Done').length > 1)
    dispatch(saveCycleTimeSettings(cycleTimeOptions))
  }, [cycleTimeOptions, dispatch])

  return (
    <>
      <MetricsSettingTitle title={title} />
      {warningMessage && <ErrorNotificationAutoDismiss message={warningMessage} />}
      {isError && (
        <ErrorDone>
          <span>Only one column can be selected as &quot;Done&quot;</span>
        </ErrorDone>
      )}
      <FormSelectPart selectedOptions={cycleTimeOptions} saveCycleTimeOptions={saveCycleTimeOptions} />
      <FlagCard />
    </>
  )
}
