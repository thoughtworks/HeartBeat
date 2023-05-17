import { FormSelect } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelect'
import React from 'react'

interface FormSelectPartProps {
  selectedOptions: { name: string; value: string }[]
  saveCycleTimeOptions: (label: string, value: string) => void
}

export const FormSelectPart = ({ selectedOptions, saveCycleTimeOptions }: FormSelectPartProps) => {
  return (
    <>
      {selectedOptions.map((item) => (
        <FormSelect
          key={item.name}
          label={item.name}
          defaultSelected={item.value}
          saveCycleTimeOptions={saveCycleTimeOptions}
        />
      ))}
    </>
  )
}
