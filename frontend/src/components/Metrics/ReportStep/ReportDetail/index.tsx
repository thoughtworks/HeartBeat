import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@src/hooks'
import { selectConfig } from '@src/context/config/configSlice'
import { PIPELINE_STEP, NAME } from '@src/constants/resources'
import { INIT_REPORT_DATA_WITH_THREE_COLUMNS, INIT_REPORT_DATA_WITH_TWO_COLUMNS } from '@src/constants/commons'
import ReportForTwoColumns from '@src/components/Common/ReportForTwoColumns'
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns'
import { selectTimeStamp } from '@src/context/stepper/StepperSlice'
import { ErrorNotification } from '@src/components/ErrorNotification'
import CollectionDuration from '@src/components/Common/CollectionDuration'
import { ReportResponse } from '@src/clients/report/dto/response'
import { ErrorNotificationContainer } from '@src/components/Metrics/ReportStep/ReportDetail/style'
import { selectReportData } from '@src/context/report/reportSlice'
import { reportMapper } from '@src/hooks/reportMapper/report'
import { ReportButtonGroup } from '@src/components/Metrics/ReportButtonGroup'
import Header from '@src/layouts/Header'

const ReportDetail = () => {
  const [errorMessage, setErrorMessage] = useState<string>()
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
  const configData = useAppSelector(selectConfig)
  const { dateRange } = configData.basic
  const { startDate, endDate } = dateRange
  const csvTimeStamp = useAppSelector(selectTimeStamp)

  const reportData = useAppSelector(selectReportData)

  useEffect(() => {
    updateReportData(reportMapper(reportData))
  })

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
      <Header />
      {startDate && endDate && <CollectionDuration startDate={startDate} endDate={endDate} />}
      {errorMessage && (
        <ErrorNotificationContainer>
          <ErrorNotification message={errorMessage} />
        </ErrorNotificationContainer>
      )}
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
      <ReportButtonGroup
        isShowSaveButton={false}
        reportData={reportData}
        startDate={startDate}
        endDate={endDate}
        setErrorMessage={(message) => {
          setErrorMessage(message)
        }}
        csvTimeStamp={csvTimeStamp}
      />
    </>
  )
}

export default ReportDetail
