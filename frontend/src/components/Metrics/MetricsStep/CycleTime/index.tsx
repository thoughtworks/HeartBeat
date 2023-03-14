import React, { useEffect, useState } from 'react'
import MetricsSettingTitle from '@src/components/Common/MetricsSettingTitle'
import FlagCard from '@src/components/Metrics/MetricsStep/CycleTime/FlagCard'
import { FormSelectPart } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelectPart'
import { ErrorDone } from '@src/components/Metrics/MetricsStep/CycleTime/style'

interface cycletimeProps {
  columns: { key: string; value: { name: string; statuses: string[] } }[]
  title: string
}

export const CycleTime = ({ columns, title }: cycletimeProps) => {
  const [isError, setIsError] = useState(false)
  const names = Object.values(columns).map((item) => item.value.name)
  const [cycleTimeOptions, setCycleTimeOptions] = useState(names.map((item) => ({ label: item, value: '' })))
  const saveCycleTimeOptions = (label: string, value: string) =>
    setCycleTimeOptions(
      cycleTimeOptions.map((item) => {
        item.label === label && (item.value = value)
        return item
      })
    )

  useEffect(() => {
    setIsError(cycleTimeOptions.filter((item) => item.value === 'Done').length > 1)
  }, [cycleTimeOptions])

  return (
    <>
      <MetricsSettingTitle title={title} />
      {isError && (
        <ErrorDone>
          <span>Should only select One &quot;Done&quot;</span>
        </ErrorDone>
      )}
      <FormSelectPart columns={columns} saveCycleTimeOptions={saveCycleTimeOptions} />
      <FlagCard />
    </>
  )
}
