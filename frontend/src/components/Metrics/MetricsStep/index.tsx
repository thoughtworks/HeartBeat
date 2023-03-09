import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { selectUsers } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'

export const MetricsStep = () => {
  const users = useAppSelector(selectUsers)

  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
      <Classification title={'Classification Setting'} label={'Distinguished By'} />
    </>
  )
}
