import React, { useEffect } from 'react'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { useAppSelector } from '@src/hooks'
import { selectConfig, selectJiraColumns } from '@src/context/config/configSlice'
import { CALENDAR } from '@src/constants/resources'
import { BoardReportRequestDTO } from '@src/clients/report/dto/request'
import { selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import dayjs from 'dayjs'
import { selectTimeStamp } from '@src/context/stepper/StepperSlice'
import { StyledMetricsSection } from '@src/components/Metrics/ReportStep/BoradMetrics/style'
import { filterAndMapCycleTimeSettings, getJiraBoardToken } from '@src/utils/util'
import { ReportTitle } from '@src/components/Common/ReportGrid/ReportTitle/ReportTitle'
import { ReportGrid } from '@src/components/Common/ReportGrid'

const BoardMetrics = () => {
  const {
    startPollingReports,
    stopPollingReports,
    boardReport = {
      velocity: {
        velocityForSP: 1,
        velocityForCards: 1,
      },
      cycleTime: {
        totalTimeForCards: 1,
        averageCycleTimePerCard: 1,
        averageCycleTimePerSP: 1,
        swimlaneList: [
          {
            optionalItemName: '1',
            averageTimeForSP: 1,
            averageTimeForCards: 1,
            totalTime: 1,
          },
        ],
      },
    },
  } = useGenerateReportEffect()
  const csvTimeStamp = useAppSelector(selectTimeStamp)
  const configData = useAppSelector(selectConfig)
  const { cycleTimeSettings, treatFlagCardAsBlock, users, targetFields, doneColumn, assigneeFilter } =
    useAppSelector(selectMetricsContent)
  const { metrics, calendarType, dateRange } = configData.basic
  const { board } = configData
  const { token, type, site, projectKey, boardId, email } = board.config
  const { startDate, endDate } = dateRange
  const jiraToken = getJiraBoardToken(token, email)
  const jiraColumns = useAppSelector(selectJiraColumns)
  const jiraColumnsWithValue = jiraColumns?.map(
    (obj: { key: string; value: { name: string; statuses: string[] } }) => obj.value
  )

  const getBoardReportRequestBody = (): BoardReportRequestDTO => ({
    metrics: metrics,
    startTime: dayjs(startDate).valueOf().toString(),
    endTime: dayjs(endDate).valueOf().toString(),
    considerHoliday: calendarType === CALENDAR.CHINA,
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

  useEffect(() => {
    startPollingReports(getBoardReportRequestBody())
  }, [])

  useEffect(() => {
    return () => {
      stopPollingReports()
    }
  })

  const getBoardItems = (): any => {
    const { velocity, cycleTime } = boardReport
    return [
      {
        title: 'Velocity',
        items: [
          {
            value: velocity.velocityForSP,
            subtitle: 'Average Cycle Time',
            unit: '(Days/SP)',
          },
          {
            value: velocity.velocityForCards,
            subtitle: 'Throughput',
            unit: '(Cards Count)',
          },
        ],
      },
      {
        title: 'Cycle Time',
        items: [
          {
            value: cycleTime.averageCycleTimePerSP,
            subtitle: 'Average Cycle Time',
            unit: '(Days/SP)',
          },
          {
            value: cycleTime.averageCycleTimePerCard,
            subtitle: 'Average Cycle Time',
            unit: '(Days/Card)',
          },
        ],
      },
    ]
  }

  return (
    <>
      {boardReport && (
        <StyledMetricsSection>
          <ReportTitle title='Board Metrics' />
          <ReportGrid reportDetails={getBoardItems()} />
        </StyledMetricsSection>
      )}
    </>
  )
}

export default BoardMetrics
