import { useEffect, useState } from 'react'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { Loading } from '@src/components/Loading'
import { useAppSelector } from '@src/hooks'
import { selectConfig } from '@src/context/config/configSlice'
import {
  CHINA_CALENDAR,
  INIT_REPORT_DATA_WITH_THREE_COLUMNS,
  INIT_REPORT_DATA_WITH_TWO_COLUMNS,
  INIT_REPORT_DATA_WITH_TWO_COLUMNS_CYCLE,
  NAME,
  PIPELINE_STEP,
} from '@src/constants'
import ReportForTwoColumns from '@src/components/Common/ReportForTwoColumns'
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns'
import { ReportRequestDTO } from '@src/clients/report/dto/request'
import { selectMetricsContent } from '@src/context/Metrics/metricsSlice'

export const ReportStep = () => {
  const { generateReport, isLoading } = useGenerateReportEffect()
  const [velocityData, setVelocityData] = useState(INIT_REPORT_DATA_WITH_TWO_COLUMNS)
  const [cycleTimeData, setCycleTimeData] = useState(INIT_REPORT_DATA_WITH_TWO_COLUMNS_CYCLE)
  const [classificationData, setClassificationData] = useState(INIT_REPORT_DATA_WITH_THREE_COLUMNS)
  const [deploymentFrequencyData, setDeploymentFrequencyData] = useState(INIT_REPORT_DATA_WITH_THREE_COLUMNS)
  const [leadTimeForChangesData, setLeadTimeForChangesData] = useState(INIT_REPORT_DATA_WITH_THREE_COLUMNS)
  const [changeFailureRateData, setChangeFailureRateData] = useState(INIT_REPORT_DATA_WITH_THREE_COLUMNS)
  const configData = useAppSelector(selectConfig)
  const { boardColumns, treatFlagCardAsBlock, users, targetFields, doneColumn } = useAppSelector(selectMetricsContent)
  const { metrics, calendarType, dateRange } = configData.basic
  const { board, pipelineTool } = configData
  const { token, type, site, projectKey, boardId } = board.config
  const params: ReportRequestDTO = {
    metrics: metrics,
    startTime: dateRange.startDate,
    endTime: dateRange.endDate,
    considerHoliday: calendarType === CHINA_CALENDAR,
    pipeline: pipelineTool.config,
    jiraBoardSetting: {
      token,
      type,
      site,
      projectKey,
      boardId,
      boardColumns,
      treatFlagCardAsBlock,
      users,
      targetFields,
      doneColumn,
    },
  }

  useEffect(() => {
    generateReport(params).then((res) => {
      if (res) {
        setVelocityData(res.velocityList)
        setCycleTimeData(res.cycleTimeList)
        setClassificationData(res.classificationList)
        setDeploymentFrequencyData(res.deploymentFrequencyList)
        setChangeFailureRateData(res.changeFailureRateList)
        setLeadTimeForChangesData(res.leadTimeForChangesList)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ReportForTwoColumns title={'Velocity'} data={velocityData} />
          <ReportForTwoColumns title={'Cycle time'} data={cycleTimeData} />
          <ReportForThreeColumns
            title={'Classifications'}
            fieldName='Field Name'
            listName='Subtitle'
            data={classificationData}
          />
          <ReportForThreeColumns
            title={'Deployment frequency'}
            fieldName={PIPELINE_STEP}
            listName={NAME}
            data={deploymentFrequencyData}
          />
          <ReportForThreeColumns
            title={'Lead time for changes'}
            fieldName={PIPELINE_STEP}
            listName={NAME}
            data={leadTimeForChangesData}
          />
          <ReportForThreeColumns
            title={'Change failure rate'}
            fieldName={PIPELINE_STEP}
            listName={NAME}
            data={changeFailureRateData}
          />
        </>
      )}
    </>
  )
}
