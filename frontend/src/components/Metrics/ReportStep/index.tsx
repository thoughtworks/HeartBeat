import { useCallback, useEffect, useState } from 'react'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { Loading } from '@src/components/Loading'
import { useAppSelector } from '@src/hooks'
import { selectConfig, selectMetrics } from '@src/context/config/configSlice'
import {
  CHINA_CALENDAR,
  ERROR_PAGE_ROUTE,
  INIT_REPORT_DATA_WITH_THREE_COLUMNS,
  INIT_REPORT_DATA_WITH_TWO_COLUMNS,
  NAME,
  PIPELINE_STEP,
  REQUIRED_DATA,
} from '@src/constants'
import ReportForTwoColumns from '@src/components/Common/ReportForTwoColumns'
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns'
import { CSVReportRequestDTO, ReportRequestDTO } from '@src/clients/report/dto/request'
import { IPipelineConfig, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import dayjs from 'dayjs'
import { ReportDataWithThreeColumns, ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure'
import { BackButton } from '@src/components/Metrics/MetricsStepper/style'
import { useExportCsvEffect } from '@src/hooks/useExportCsvEffect'
import { backStep, selectTimeStamp } from '@src/context/stepper/StepperSlice'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { ButtonGroupStyle, ErrorNotificationContainer, ExportButton } from '@src/components/Metrics/ReportStep/style'
import { ErrorNotification } from '@src/components/ErrorNotification'
import { useNavigate } from 'react-router-dom'
import CollectionDuration from '@src/components/Common/CollectionDuration'

const ReportStep = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { generateReport, isLoading, isServerError, errorMessage: reportErrorMsg } = useGenerateReportEffect()
  const { fetchExportData, errorMessage } = useExportCsvEffect()
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
  const csvTimeStamp = useAppSelector(selectTimeStamp)
  const configData = useAppSelector(selectConfig)
  const {
    cycleTimeSettings,
    treatFlagCardAsBlock,
    users,
    pipelineCrews,
    targetFields,
    doneColumn,
    deploymentFrequencySettings,
    leadTimeForChanges,
    assigneeFilter,
  } = useAppSelector(selectMetricsContent)
  const { metrics, calendarType, dateRange } = configData.basic
  const { board, pipelineTool, sourceControl } = configData
  const { token, type, site, projectKey, boardId, email } = board.config
  const { startDate, endDate } = dateRange
  const requiredData = useAppSelector(selectMetrics)
  const isShowExportBoardButton =
    requiredData.includes(REQUIRED_DATA.VELOCITY) ||
    requiredData.includes(REQUIRED_DATA.CYCLE_TIME) ||
    requiredData.includes(REQUIRED_DATA.CLASSIFICATION)
  const isShowExportPipelineButton =
    requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) ||
    requiredData.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE) ||
    requiredData.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES) ||
    requiredData.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)

  const getPipelineConfig = (pipelineConfigs: IPipelineConfig[]) => {
    if (!pipelineConfigs[0].organization && pipelineConfigs.length === 1) {
      return []
    }
    return pipelineConfigs.map(({ organization, pipelineName, step, branches }) => {
      const pipelineConfigFromPipelineList = configData.pipelineTool.verifiedResponse.pipelineList.find(
        (pipeline) => pipeline.name === pipelineName && pipeline.orgName === organization
      )
      if (pipelineConfigFromPipelineList != undefined) {
        const { orgName, orgId, name, id, repository } = pipelineConfigFromPipelineList
        return {
          orgId,
          orgName,
          id,
          name,
          step,
          repository,
          branches,
        }
      }
    }) as {
      id: string
      name: string
      orgId: string
      orgName: string
      repository: string
      step: string
      branches: string[]
    }[]
  }

  const msg = `${email}:${token}`
  const encodeToken = `Basic ${btoa(msg)}`
  const getReportRequestBody = (): ReportRequestDTO => ({
    metrics: metrics,
    startTime: dayjs(startDate).valueOf().toString(),
    endTime: dayjs(endDate).valueOf().toString(),
    considerHoliday: calendarType === CHINA_CALENDAR,
    buildKiteSetting: {
      pipelineCrews,
      ...pipelineTool.config,
      deploymentEnvList: getPipelineConfig(deploymentFrequencySettings),
    },
    codebaseSetting: {
      type: sourceControl.config.type,
      token: sourceControl.config.token,
      leadTime: getPipelineConfig(leadTimeForChanges),
    },
    jiraBoardSetting: {
      token: encodeToken,
      type: type.toLowerCase().replace(' ', '-'),
      site,
      projectKey,
      boardId,
      boardColumns: cycleTimeSettings.filter((item) => item.value != '----'),
      treatFlagCardAsBlock,
      users,
      assigneeFilter,
      targetFields,
      doneColumn,
    },
    csvTimeStamp: csvTimeStamp,
  })

  const getExportCSV = (dataType: string, startDate: string | null, endDate: string | null): CSVReportRequestDTO => ({
    dataType: dataType,
    csvTimeStamp: csvTimeStamp,
    startDate: startDate ?? '',
    endDate: endDate ?? '',
  })

  const fetchReportData: () => Promise<
    | {
        velocityList?: ReportDataWithTwoColumns[]
        cycleTimeList?: ReportDataWithTwoColumns[]
        classification?: ReportDataWithThreeColumns[]
        deploymentFrequencyList?: ReportDataWithThreeColumns[]
        meanTimeToRecoveryList?: ReportDataWithThreeColumns[]
        leadTimeForChangesList?: ReportDataWithThreeColumns[]
        changeFailureRateList?: ReportDataWithThreeColumns[]
      }
    | undefined
  > = useCallback(async () => {
    return await generateReport(getReportRequestBody())
  }, [])

  useEffect(() => {
    fetchReportData().then((res) => {
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
    })
  }, [fetchReportData])

  const handleDownload = (dataType: string, startDate: string | null, endDate: string | null) => {
    fetchExportData(getExportCSV(dataType, startDate, endDate))
  }

  const handleBack = () => {
    dispatch(backStep())
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isServerError ? (
        navigate(ERROR_PAGE_ROUTE)
      ) : (
        <>
          {startDate && endDate && <CollectionDuration startDate={startDate} endDate={endDate} />}
          {reportErrorMsg && (
            <ErrorNotificationContainer>
              <ErrorNotification message={reportErrorMsg} />
            </ErrorNotificationContainer>
          )}
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
          <ButtonGroupStyle>
            <BackButton onClick={handleBack} variant='outlined'>
              Previous
            </BackButton>
            {isShowExportBoardButton && (
              <ExportButton onClick={() => handleDownload('board', startDate, endDate)}>Export board data</ExportButton>
            )}
            {isShowExportPipelineButton && (
              <ExportButton onClick={() => handleDownload('pipeline', startDate, endDate)}>
                Export pipeline data
              </ExportButton>
            )}
          </ButtonGroupStyle>
        </>
      )}
    </>
  )
}

export default ReportStep
