import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { RealDone } from '@src/components/Metrics/MetricsStep/RealDone'
import {
  selectedJiraColumns,
  selectTargetFields,
  selectUsers,
} from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'
import { DONE } from '@src/constants'

export const MetricsStep = () => {
  const users = useAppSelector(selectUsers)
  // const jiraColumns = useAppSelector(selectedJiraColumns)
  // const doneColumn = jiraColumns.find((jiraColumn) => jiraColumn.key === DONE)?.value.statuses ?? []
  const doneColumn = ['DONE', 'CANCELLED']
  const targetFields = useAppSelector(selectTargetFields)
  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
      <RealDone options={doneColumn} title={'Real Done'} label={'Consider as Done'} />
      <Classification options={targetFields} title={'Classification Setting'} label={'Distinguished By'} />
    </>
  )
}
