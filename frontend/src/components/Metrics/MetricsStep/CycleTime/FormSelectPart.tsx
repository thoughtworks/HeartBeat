import { FormSelect } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelect'
import React from 'react'
import { FormSelectPartContainer } from '@src/components/Metrics/MetricsStep/CycleTime/style'
import { useAppSelector } from '@src/hooks'
import { selectJiraColumns } from '@src/context/config/configSlice'

interface FormSelectPartProps {
  selectedOptions: { name: string; value: string }[]
  saveCycleTimeOptions: (label: string, value: string) => void
}

export const FormSelectPart = ({ selectedOptions, saveCycleTimeOptions }: FormSelectPartProps) => {
  const jiraColumns = useAppSelector(selectJiraColumns)
  const jiraColumnsWithValue = jiraColumns?.map(
    (obj: { key: string; value: { name: string; statuses: string[] } }) => obj.value
  )
  return (
    <FormSelectPartContainer>
      {selectedOptions.map((item) => {
        const matchingJiraColumn = jiraColumnsWithValue?.find((column) => column.name === item.name)
        return (
          <FormSelect
            key={item.name}
            label={`${matchingJiraColumn?.name} (${matchingJiraColumn?.statuses.join(', ')})`}
            name={`${matchingJiraColumn?.name}`}
            defaultSelected={item.value}
            saveCycleTimeOptions={saveCycleTimeOptions}
          />
        )
      })}
    </FormSelectPartContainer>
  )
}
