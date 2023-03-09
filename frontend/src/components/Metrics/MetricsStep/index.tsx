import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { selectColumns } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'
import { selectTargetFields, selectUsers } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'

export const MetricsStep = () => {
  const users = useAppSelector(selectUsers)
  const columns = useAppSelector(selectColumns)

  const targetFields = useAppSelector(selectTargetFields)
  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
      <CycleTime options={columns} title={'Cycle Time Setting'} />
      <Classification options={targetFields} title={'Classification Setting'} label={'Distinguished By'} />
    </>
  )
}
