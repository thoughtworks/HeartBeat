import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { selectTargetFields, selectUsers } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'
import { selectMetrics } from '@src/context/config/configSlice'
import { REQUIRED_DATA_LIST } from '@src/constants'

export const MetricsStep = () => {
  const requiredData = useAppSelector(selectMetrics)
  const users = useAppSelector(selectUsers)
  const targetFields = useAppSelector(selectTargetFields)

  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
      {requiredData.length > 0 && requiredData.includes(REQUIRED_DATA_LIST[2]) && (
        <Classification options={targetFields} title={'Classification Setting'} label={'Distinguished By'} />
      )}
    </>
  )
}
