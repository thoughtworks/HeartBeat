import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { selectUsers } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'

export const MetricsStep = () => {
  const users = useAppSelector(selectUsers)

  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
    </>
  )
}
