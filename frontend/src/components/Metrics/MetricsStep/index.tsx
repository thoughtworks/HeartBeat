import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { selectUsers } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'
import { CYCLETIME_LIST } from '@src/constants'

export const MetricsStep = () => {
  const users = useAppSelector(selectUsers)

  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
      <CycleTime options={CYCLETIME_LIST} title={'Cycle Time Setting'} />
    </>
  )
}
