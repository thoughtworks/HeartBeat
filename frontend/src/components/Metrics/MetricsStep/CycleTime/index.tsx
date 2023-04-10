import React, { useEffect, useState } from 'react'
import MetricsSettingTitle from '@src/components/Common/MetricsSettingTitle'
import FlagCard from '@src/components/Metrics/MetricsStep/CycleTime/FlagCard'
import { FormSelectPart } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelectPart'
import { ErrorDone } from '@src/components/Metrics/MetricsStep/CycleTime/style'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { saveBoardColumns, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import { useAppSelector } from '@src/hooks'

interface cycleTimeProps {
  columns: { key: string; value: { name: string; statuses: string[] } }[]
  title: string
}

export const CycleTime = ({ columns, title }: cycleTimeProps) => {
  const dispatch = useAppDispatch()
  const [isError, setIsError] = useState(false)
  const boardColumns = useAppSelector(selectMetricsContent).boardColumns
  const defaultValue = boardColumns.map((item) => {
    const [name, value] = Object.entries(item)[0]
    return { name, value }
  })
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
    dispatch(saveBoardColumns(cycleTimeOptions))
  }, [cycleTimeOptions, dispatch])

  return (
    <>
      <MetricsSettingTitle title={title} />
      {isError && (
        <ErrorDone>
          <span>Only one column can be selected as &quot;Done&quot;</span>
        </ErrorDone>
      )}
      <FormSelectPart
        columnsOption={columnsOption}
        selectedOptions={cycleTimeOptions}
        saveCycleTimeOptions={saveCycleTimeOptions}
      />
      <FlagCard />
    </>
  )
}
