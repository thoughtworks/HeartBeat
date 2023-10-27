import { FormControlLabel, RadioGroup, Radio } from '@mui/material'
import React from 'react'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { useAppSelector } from '@src/hooks'
import { selectAssigneeFilter, updateAssigneeFilter } from '@src/context/Metrics/metricsSlice'

export const AssigneeFilter = () => {
  const dispatch = useAppDispatch()
  const assigneeFilter = useAppSelector(selectAssigneeFilter)

  const handleChange = (event) => {
    dispatch(updateAssigneeFilter(event.target.value))
  }

  return (
    <>
      <RadioGroup
        aria-label='UserFilter'
        name='UserFilter'
        value={assigneeFilter}
        onChange={handleChange}
        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <FormControlLabel value='lastAssignee' control={<Radio />} label='Last Assignee' />
        <FormControlLabel value='historicalAssignee' control={<Radio />} label='Historical Assignee' />
      </RadioGroup>
    </>
  )
}
