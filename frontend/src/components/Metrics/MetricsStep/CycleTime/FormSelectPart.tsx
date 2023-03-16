import { FormSelect } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelect'
import React from 'react'
import { METRICS_CONSTANTS } from '@src/constants'

interface FormSelectPartProps {
  columns: { key: string; value: { name: string; statuses: string[] } }[]
  saveCycleTimeOptions: (label: string, value: string) => void
}

export const FormSelectPart = ({ columns, saveCycleTimeOptions }: FormSelectPartProps) => {
  const names = Object.values(columns).map((item) => item.value.name)

  return (
    <>
      {names.map((item) => (
        <FormSelect
          key={item}
          label={item}
          defaultSelected={[METRICS_CONSTANTS.cycleTimeEmptyStr]}
          saveCycleTimeOptions={saveCycleTimeOptions}
        />
      ))}
    </>
  )
}
