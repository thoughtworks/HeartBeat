import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { selectUsers } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { RealDone } from '@src/components/Metrics/MetricsStep/RealDone'

export const MetricsStep = () => {
  const users = useAppSelector(selectUsers)
  const realDoneOptions = ['DONE', 'CANCELLED']
  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
      <RealDone options={realDoneOptions} title={'Real Done'} label={'Consider as Done'} />
    </>
  )
}
