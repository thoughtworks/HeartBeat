import React, { useEffect, useState } from 'react'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import FlagCard from '@src/components/Metrics/MetricsStep/CycleTime/FlagCard'
import { FormSelectPart } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelectPart'
import { ErrorDone } from '@src/components/Metrics/MetricsStep/CycleTime/style'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { saveCycleTimeSettings, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import { useAppSelector } from '@src/hooks'
import { CYCLE_TIME_LIST, METRICS_CONSTANTS } from '@src/constants'

interface cycleTimeProps {
  columns: { key: string; value: { name: string; statuses: string[] } }[]
  title: string
}

export const CycleTime = ({ columns, title }: cycleTimeProps) => {
  const dispatch = useAppDispatch()
  const [isError, setIsError] = useState(false)
  const importedCycleTimeSettings = useAppSelector(selectMetricsContent).importedCycleTimeSettings
  const getDefaultOptionValue = (
    item: { key: string; value: { name: string; statuses: string[] } },
    importedCycleTimeSettings: { name: string; value: string }[]
  ) => {
    const controlName = item.value.name
    let defaultOptionValue = METRICS_CONSTANTS.cycleTimeEmptyStr
    const validImportValue = importedCycleTimeSettings?.find((i) => Object.keys(i)[0] === controlName)

    if (validImportValue && CYCLE_TIME_LIST.includes(Object.values(validImportValue)[0])) {
      defaultOptionValue = Object.values(validImportValue)[0]
    }

    return { name: controlName, value: defaultOptionValue }
  }
  const defaultValue = Object.values(columns).map((item) => getDefaultOptionValue(item, importedCycleTimeSettings))
  const isProjectCreated = useAppSelector(selectMetricsContent).isProjectCreated
  const columnsOption = Object.values(columns).map((item) => ({ name: item.value.name, value: '' }))
  const [cycleTimeOptions, setCycleTimeOptions] = useState(isProjectCreated ? columnsOption : defaultValue)

  const saveCycleTimeOptions = (name: string, value: string) =>
    setCycleTimeOptions(
      cycleTimeOptions.map((item) => {
        if (item.name === name) {
          item = JSON.parse(JSON.stringify(item))
          item.value = value
        }
        return item
      })
    )

  useEffect(() => {
    setIsError(cycleTimeOptions.filter((item) => item.value === 'Done').length > 1)
    dispatch(saveCycleTimeSettings(cycleTimeOptions))
  }, [cycleTimeOptions, dispatch])

  return (
    <>
      <MetricsSettingTitle title={title} />
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
