import { FormSelect } from '@src/components/common/FormSelect'
import React from 'react'
import { METRICS_CONSTANTS } from '@src/constants'

interface FormSelectPartProps {
  columns: string[]
}

export const FormSelectPart = ({ columns }: FormSelectPartProps) => (
  <>
    {columns.map((item) => (
      <FormSelect key={item} label={item} defaultSelected={[METRICS_CONSTANTS.cycleTimeEmptyStr]} />
    ))}
  </>
)
