import { useEffect, useLayoutEffect, useState } from 'react'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { Loading } from '@src/components/Loading'
import { useAppSelector } from '@src/hooks'
import { selectConfig, selectJiraColumns, selectMetrics } from '@src/context/config/configSlice'
import { CALENDAR, PIPELINE_STEP, NAME, REQUIRED_DATA, MESSAGE, TIPS } from '@src/constants/resources'
import {
  COMMON_BUTTONS,
  DOWNLOAD_TYPES,
  INIT_REPORT_DATA_WITH_THREE_COLUMNS,
  INIT_REPORT_DATA_WITH_TWO_COLUMNS,
} from '@src/constants/commons'
import ReportForTwoColumns from '@src/components/Common/ReportForTwoColumns'
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns'
import { CSVReportRequestDTO, ReportRequestDTO } from '@src/clients/report/dto/request'
import { IPipelineConfig, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import dayjs from 'dayjs'
import { BackButton, SaveButton } from '@src/components/Metrics/MetricsStepper/style'
import { useExportCsvEffect } from '@src/hooks/useExportCsvEffect'
import { backStep, selectTimeStamp } from '@src/context/stepper/StepperSlice'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { ButtonGroupStyle, ErrorNotificationContainer, ExportButton } from '@src/components/Metrics/ReportStep/style'
import { ErrorNotification } from '@src/components/ErrorNotification'
import { useNavigate } from 'react-router-dom'
import CollectionDuration from '@src/components/Common/CollectionDuration'
import { ExpiredDialog } from '@src/components/Metrics/ReportStep/ExpiredDialog'
import { filterAndMapCycleTimeSettings, getJiraBoardToken } from '@src/utils/util'
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect'
import { ReportResponse } from '@src/clients/report/dto/response'
import { ROUTE } from '@src/constants/router'
import { Tooltip } from '@mui/material'
import SaveAltIcon from '@mui/icons-material/SaveAlt'

interface ReportStepInterface extends useNotificationLayoutEffectInterface {
  handleSave: () => void
}

const ReportStep = ({ updateProps, handleSave }: ReportStepInterface) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    startPollingReports,
    stopPollingReports,
    reports,
    isLoading,
    isServerError,
    errorMessage: reportErrorMsg,
  } = useGenerateReportEffect()
  const { fetchExportData, errorMessage, isExpired } = useExportCsvEffect()
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
  const [exportValidityTimeMin, setExportValidityTimeMin] = useState<number | undefined>(undefined)
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

  const jiraColumns = useAppSelector(selectJiraColumns)
  const jiraColumnsWithValue = jiraColumns?.map(
    (obj: { key: string; value: { name: string; statuses: string[] } }) => obj.value
  )

  const jiraToken = getJiraBoardToken(token, email)
  const getReportRequestBody = (): ReportRequestDTO => ({
    metrics: metrics,
    startTime: dayjs(startDate).valueOf().toString(),
    endTime: dayjs(endDate).valueOf().toString(),
    considerHoliday: calendarType === CALENDAR.CHINA,
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
      token: jiraToken,
      type: type.toLowerCase().replace(' ', '-'),
      site,
      projectKey,
      boardId,
      boardColumns: filterAndMapCycleTimeSettings(cycleTimeSettings, jiraColumnsWithValue),
      treatFlagCardAsBlock,
      users,
      assigneeFilter,
      targetFields,
      doneColumn,
    },
    csvTimeStamp: csvTimeStamp,
  })

  const getExportCSV = (
    dataType: DOWNLOAD_TYPES,
    startDate: string | null,
    endDate: string | null
  ): CSVReportRequestDTO => ({
    dataType: dataType,
    csvTimeStamp: csvTimeStamp,
    startDate: startDate ?? '',
    endDate: endDate ?? '',
  })

  useLayoutEffect(() => {
    exportValidityTimeMin &&
      updateProps?.({
        open: true,
        title: MESSAGE.NOTIFICATION_FIRST_REPORT.replace('%s', exportValidityTimeMin.toString()),
        closeAutomatically: true,
      })
  }, [exportValidityTimeMin])

  useLayoutEffect(() => {
    if (exportValidityTimeMin) {
      const startTime = Date.now()
      const timer = setInterval(() => {
        const currentTime = Date.now()
        const elapsedTime = currentTime - startTime

        const remainingExpireTime = 5 * 60 * 1000
        const remainingTime = exportValidityTimeMin * 60 * 1000 - elapsedTime
        if (remainingTime <= remainingExpireTime) {
          updateProps?.({
            open: true,
            title: MESSAGE.EXPIRE_IN_FIVE_MINUTES,
            closeAutomatically: true,
          })
          clearInterval(timer)
        }
      }, 1000)

      return () => {
        clearInterval(timer)
      }
    }
  }, [exportValidityTimeMin])

  useEffect(() => {
    startPollingReports(getReportRequestBody())
  }, [])

  useEffect(() => {
    updateReportData(reports)
    return () => {
      stopPollingReports()
    }
  }, [reports])

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
    res?.exportValidityTimeMin && setExportValidityTimeMin(res.exportValidityTimeMin)
  }

  const handleDownload = (dataType: DOWNLOAD_TYPES, startDate: string | null, endDate: string | null) => {
    fetchExportData(getExportCSV(dataType, startDate, endDate))
  }

  const handleBack = () => {
    dispatch(backStep())
  }

  return (
    <>
      {isLoading ? (
        <Loading message={MESSAGE.REPORT_LOADING} />
      ) : isServerError ? (
        navigate(ROUTE.ERROR_PAGE)
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
            <Tooltip title={TIPS.SAVE_CONFIG} placement={'right'}>
              <SaveButton variant='text' onClick={handleSave} startIcon={<SaveAltIcon />}>
                {COMMON_BUTTONS.SAVE}
              </SaveButton>
            </Tooltip>
            <div>
              <BackButton onClick={handleBack} variant='outlined'>
                {COMMON_BUTTONS.BACK}
              </BackButton>
              <ExportButton onClick={() => handleDownload(DOWNLOAD_TYPES.METRICS, startDate, endDate)}>
                {COMMON_BUTTONS.EXPORT_METRIC_DATA}
              </ExportButton>
              {isShowExportBoardButton && (
                <ExportButton onClick={() => handleDownload(DOWNLOAD_TYPES.BOARD, startDate, endDate)}>
                  {COMMON_BUTTONS.EXPORT_BOARD_DATA}
                </ExportButton>
              )}
              {isShowExportPipelineButton && (
                <ExportButton onClick={() => handleDownload(DOWNLOAD_TYPES.PIPELINE, startDate, endDate)}>
                  {COMMON_BUTTONS.EXPORT_PIPELINE_DATA}
                </ExportButton>
              )}
            </div>
          </ButtonGroupStyle>
          {<ExpiredDialog isExpired={isExpired} handleOk={handleBack} />}
        </>
      )}
    </>
  )
}

export default ReportStep
