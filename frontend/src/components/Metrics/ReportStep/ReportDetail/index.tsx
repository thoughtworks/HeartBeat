import { ReportResponse } from '@src/clients/report/dto/response'
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns'
import ReportForTwoColumns from '@src/components/Common/ReportForTwoColumns'
import { INIT_REPORT_DATA_WITH_THREE_COLUMNS, INIT_REPORT_DATA_WITH_TWO_COLUMNS } from '@src/constants/commons'
import { NAME, PIPELINE_STEP } from '@src/constants/resources'
import { selectReportData } from '@src/context/report/reportSlice'
import { useAppSelector } from '@src/hooks'
import { reportMapper } from '@src/hooks/reportMapper/report'
import { useEffect, useState } from 'react'

const ReportDetail = ({ onBack }: { onBack: () => void }) => {
  const [velocityState, setVelocityState] = useState({ value: INIT_REPORT_DATA_WITH_TWO_COLUMNS, isShow: false })
  const [cycleTimeState, setCycleTimeState] = useState({ value: INIT_REPORT_DATA_WITH_TWO_COLUMNS, isShow: false })
  const [classificationState, setClassificationState] = useState({
    value: INIT_REPORT_DATA_WITH_THREE_COLUMNS,
    isShow: false,
  })
  const [deploymentFrequencyState, setDeploymentFrequencyState] = useState({
    value: INIT_REPORT_DATA_WITH_THREE_COLUMNS,
    isShow: false,
  })
  const [meanTimeToRecoveryState, setMeanTimeToRecoveryState] = useState({
    value: INIT_REPORT_DATA_WITH_THREE_COLUMNS,
    isShow: false,
  })
  const [leadTimeForChangesState, setLeadTimeForChangesState] = useState({
    value: INIT_REPORT_DATA_WITH_THREE_COLUMNS,
    isShow: false,
  })
  const [changeFailureRateState, setChangeFailureRateState] = useState({
    value: INIT_REPORT_DATA_WITH_THREE_COLUMNS,
    isShow: false,
  })

  const reportData = useAppSelector(selectReportData)

  useEffect(() => {
    updateReportData(reportMapper(reportData!))
  }, [reportData])

  const updateReportData = (res: ReportResponse | undefined) => {
    res?.velocityList && setVelocityState({ ...velocityState, value: res.velocityList, isShow: true })
    res?.cycleTimeList && setCycleTimeState({ ...cycleTimeState, value: res.cycleTimeList, isShow: true })
    res?.classification && setClassificationState({ value: res.classification, isShow: true })
    res?.deploymentFrequencyList &&
      setDeploymentFrequencyState({
        ...deploymentFrequencyState,
        value: res.deploymentFrequencyList,
        isShow: true,
      })
    res?.meanTimeToRecoveryList &&
      setMeanTimeToRecoveryState({
        ...meanTimeToRecoveryState,
        value: res.meanTimeToRecoveryList,
        isShow: true,
      })
    res?.changeFailureRateList &&
      setChangeFailureRateState({
        ...changeFailureRateState,
        value: res.changeFailureRateList,
        isShow: true,
      })
    res?.leadTimeForChangesList &&
      setLeadTimeForChangesState({
        ...leadTimeForChangesState,
        value: res.leadTimeForChangesList,
        isShow: true,
      })
  }

  return (
    <>
      <div onClick={onBack}>{'< back'}</div>
      {velocityState.isShow && <ReportForTwoColumns title={'Velocity'} data={velocityState.value} />}
      {cycleTimeState.isShow && <ReportForTwoColumns title={'Cycle time'} data={cycleTimeState.value} />}
      {classificationState.isShow && (
        <ReportForThreeColumns
          title={'Classifications'}
          fieldName='Field Name'
          listName='Subtitle'
          data={classificationState.value}
        />
      )}
      {deploymentFrequencyState.isShow && (
        <ReportForThreeColumns
          title={'Deployment frequency'}
          fieldName={PIPELINE_STEP}
          listName={NAME}
          data={deploymentFrequencyState.value}
        />
      )}
      {leadTimeForChangesState.isShow && (
        <ReportForThreeColumns
          title={'Lead time for changes'}
          fieldName={PIPELINE_STEP}
          listName={NAME}
          data={leadTimeForChangesState.value}
        />
      )}
      {changeFailureRateState.isShow && (
        <ReportForThreeColumns
          title={'Change failure rate'}
          fieldName={PIPELINE_STEP}
          listName={NAME}
          data={changeFailureRateState.value}
        />
      )}
      {meanTimeToRecoveryState.isShow && (
        <ReportForThreeColumns
          title={'Mean Time To Recovery'}
          fieldName={PIPELINE_STEP}
          listName={NAME}
          data={meanTimeToRecoveryState.value}
        />
      )}
    </>
  )
}

export default ReportDetail
