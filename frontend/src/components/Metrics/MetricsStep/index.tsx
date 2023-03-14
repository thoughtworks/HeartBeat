import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import {
  selectTargetFields,
  selectJiraColumns,
  selectUsers,
} from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'

export const MetricsStep = () => {
  const users = useAppSelector(selectUsers)
  const targetFields = useAppSelector(selectTargetFields)
  const jiraColumns = useAppSelector(selectJiraColumns)

  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
      <CycleTime columns={jiraColumns} title={'Cycle Time Setting'} />
      <Classification options={targetFields} title={'Classification Setting'} label={'Distinguished By'} />
    </>
  )
}
