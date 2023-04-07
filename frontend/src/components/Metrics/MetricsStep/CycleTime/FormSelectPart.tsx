import { FormSelect } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelect'
import React from 'react'
import { METRICS_CONSTANTS } from '@src/constants'

interface FormSelectPartProps {
  columnsOption: { name: string; value: string }[]
  selectedOptions: { name: string; value: string }[]
  saveCycleTimeOptions: (label: string, value: string) => void
}

export const FormSelectPart = ({ columnsOption, selectedOptions, saveCycleTimeOptions }: FormSelectPartProps) => {
  const newColumns = columnsOption.map((item) => {
    const option = selectedOptions.find((opt) => opt.name === item.name)
    return {
      ...item,
      value: option ? option.value : '',
    }
  })

  return (
    <>
      {newColumns.map((item) => (
        <FormSelect
          key={item.name}
          label={item.name}
          defaultSelected={item.value || METRICS_CONSTANTS.cycleTimeEmptyStr}
          saveCycleTimeOptions={saveCycleTimeOptions}
        />
      ))}
    </>
  )
}
