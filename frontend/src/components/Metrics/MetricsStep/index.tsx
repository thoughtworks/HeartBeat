import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { selectUsers } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { selectColumns } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'

export const MetricsStep = () => {
  const users = useAppSelector(selectUsers)
  const columns = useAppSelector(selectColumns)

  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
      <CycleTime options={columns} title={'Cycle Time Setting'} />
    </>
  )
}
