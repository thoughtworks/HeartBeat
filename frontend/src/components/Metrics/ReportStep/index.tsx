import { useCallback, useEffect, useState } from 'react'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { Loading } from '@src/components/Loading'
import { useAppSelector } from '@src/hooks'
import { selectConfig } from '@src/context/config/configSlice'
import {
  CHINA_CALENDAR,
  INIT_REPORT_DATA_WITH_THREE_COLUMNS,
  INIT_REPORT_DATA_WITH_TWO_COLUMNS,
  NAME,
  PIPELINE_STEP,
} from '@src/constants'
import ReportForTwoColumns from '@src/components/Common/ReportForTwoColumns'
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns'
import { ReportRequestDTO } from '@src/clients/report/dto/request'
import { IPipelineConfig, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import dayjs from 'dayjs'
import { ReportDataWithThreeColumns, ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure'

export const ReportStep = () => {
  const { generateReport, isLoading } = useGenerateReportEffect()
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
  const [leadTimeForChangesState, setLeadTimeForChangesState] = useState({
    value: INIT_REPORT_DATA_WITH_THREE_COLUMNS,
    isShow: false,
  })
  const [changeFailureRateState, setChangeFailureRateState] = useState({
    value: INIT_REPORT_DATA_WITH_THREE_COLUMNS,
    isShow: false,
  })
  const configData = useAppSelector(selectConfig)
  const {
    boardColumns,
    treatFlagCardAsBlock,
    users,
    targetFields,
    doneColumn,
    deploymentFrequencySettings,
    leadTimeForChanges,
  } = useAppSelector(selectMetricsContent)
  const { metrics, calendarType, dateRange } = configData.basic
  const { board, pipelineTool, sourceControl } = configData
  const { token, type, site, projectKey, boardId } = board.config

  const getPipelineConfig = (pipelineConfigs: IPipelineConfig[]) => {
    if (!pipelineConfigs[0].organization && pipelineConfigs.length === 1) {
      return []
    }
    return pipelineConfigs.map(({ organization, pipelineName, step }) => {
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
        }
      }
    }) as { id: string; name: string; orgId: string; orgName: string; repository: string; step: string }[]
  }
  const getReportRequestBody = (): ReportRequestDTO => ({
    metrics: metrics,
    startTime: dayjs(dateRange.startDate).valueOf().toString(),
    endTime: dayjs(dateRange.endDate).valueOf().toString(),
    considerHoliday: calendarType === CHINA_CALENDAR,
    buildKiteSetting: {
      ...pipelineTool.config,
      deploymentEnvList: getPipelineConfig(deploymentFrequencySettings),
    },
    codebaseSetting: {
      type: sourceControl.config.type,
      token: sourceControl.config.token,
      leadTime: getPipelineConfig(leadTimeForChanges),
    },
    jiraBoardSetting: {
      token,
      type: type.toLowerCase(),
      site,
      projectKey,
      boardId,
      boardColumns,
      treatFlagCardAsBlock,
      users,
      targetFields,
      doneColumn,
    },
  })

  const fetchReportData: () => Promise<
    | {
        velocityList?: ReportDataWithTwoColumns[]
        cycleTimeList?: ReportDataWithTwoColumns[]
        classificationList?: ReportDataWithThreeColumns[]
        deploymentFrequencyList?: ReportDataWithThreeColumns[]
        leadTimeForChangesList?: ReportDataWithThreeColumns[]
        changeFailureRateList?: ReportDataWithThreeColumns[]
      }
    | undefined
  > = useCallback(async () => {
    const res = await generateReport(getReportRequestBody())
    return res
  }, [])

  useEffect(() => {
    fetchReportData().then((res) => {
      res?.velocityList && setVelocityState({ ...velocityState, value: res.velocityList, isShow: true })
      res?.cycleTimeList && setCycleTimeState({ ...cycleTimeState, value: res.cycleTimeList, isShow: true })
      res?.classificationList && setClassificationState({ value: res.classificationList, isShow: true })
      res?.deploymentFrequencyList &&
        setDeploymentFrequencyState({
          ...deploymentFrequencyState,
          value: res.deploymentFrequencyList,
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

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
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
        </>
      )}
    </>
  )
}
