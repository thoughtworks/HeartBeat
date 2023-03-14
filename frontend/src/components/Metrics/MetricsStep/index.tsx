import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { RealDone } from '@src/components/Metrics/MetricsStep/RealDone'
import {
  selectDoneColumn,
  selectTargetFields,
  selectUsers,
} from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'

export const MetricsStep = () => {
  const users = useAppSelector(selectUsers)
  const doneColumn = useAppSelector(selectDoneColumn) ?? []
  const targetFields = useAppSelector(selectTargetFields)
  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
      <RealDone options={doneColumn} title={'Real Done'} label={'Consider as Done'} />
      <Classification options={targetFields} title={'Classification Setting'} label={'Distinguished By'} />
    </>
  )
}
