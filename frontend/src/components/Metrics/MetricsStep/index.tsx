import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { selectJiraColumns, selectUsers } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'

export const MetricsStep = () => {
  const users = useAppSelector(selectUsers)
  const jiraColumns = useAppSelector(selectJiraColumns)
  const jiraColumnsList = Object.values(jiraColumns).map((item) => item.value.name)

  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
      <CycleTime columns={jiraColumnsList} title={'Cycle Time Setting'} />
    </>
  )
}
