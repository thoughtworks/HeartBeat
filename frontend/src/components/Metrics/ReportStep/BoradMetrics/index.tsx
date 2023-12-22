import React, { useEffect } from 'react'
import { useAppSelector } from '@src/hooks'
import { selectConfig, selectJiraColumns } from '@src/context/config/configSlice'
import { BOARD_METRICS, CALENDAR, REPORT_PAGE } from '@src/constants/resources'
import { BoardReportRequestDTO, ReportRequestDTO } from '@src/clients/report/dto/request'
import { selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import dayjs from 'dayjs'
import { StyledMetricsSection } from '@src/components/Metrics/ReportStep/BoradMetrics/style'
import { filterAndMapCycleTimeSettings, getJiraBoardToken } from '@src/utils/util'
import { ReportTitle } from '@src/components/Common/ReportGrid/ReportTitle'
import { ReportGrid } from '@src/components/Common/ReportGrid'
import { ReportResponseDTO } from '@src/clients/report/dto/response'

interface BoardMetricsProps {
  startToRequestBoardData: (request: ReportRequestDTO) => void
  boardReport?: ReportResponseDTO
  csvTimeStamp: number
  startDate: string | null
  endDate: string | null
}

const BoardMetrics = ({
  startToRequestBoardData,
  boardReport,
  csvTimeStamp,
  startDate,
  endDate,
}: BoardMetricsProps) => {
  const configData = useAppSelector(selectConfig)
  const { cycleTimeSettings, treatFlagCardAsBlock, users, targetFields, doneColumn, assigneeFilter } =
    useAppSelector(selectMetricsContent)
  const { metrics, calendarType } = configData.basic
  const { board } = configData
  const { token, type, site, projectKey, boardId, email } = board.config
  const jiraToken = getJiraBoardToken(token, email)
  const jiraColumns = useAppSelector(selectJiraColumns)
  const jiraColumnsWithValue = jiraColumns?.map(
    (obj: { key: string; value: { name: string; statuses: string[] } }) => obj.value
  )

  const getBoardReportRequestBody = (): BoardReportRequestDTO => {
    const boardMetrics = metrics.filter((metric) => BOARD_METRICS.includes(metric))
    return {
      metrics: boardMetrics,
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
    }
  }

  const getBoardItems = (): any => {
    const velocity = boardReport?.velocity
    const cycleTime = boardReport?.cycleTime
    return [
      {
        title: 'Velocity',
        items: velocity
          ? [
              {
                value: velocity.velocityForSP,
                subtitle: 'Average Cycle Time',
                unit: 'Days/SP',
              },
              {
                value: velocity.velocityForCards,
                subtitle: 'Throughput',
                unit: 'Cards Count',
              },
            ]
          : null,
      },
      {
        title: 'Cycle Time',
        items: cycleTime
          ? [
              {
                value: cycleTime.averageCycleTimePerSP,
                subtitle: 'Average Cycle Time',
                unit: 'Days/SP',
              },
              {
                value: cycleTime.averageCycleTimePerCard,
                subtitle: 'Average Cycle Time',
                unit: 'Days/Card',
              },
            ]
          : null,
      },
    ]
  }

  useEffect(() => {
    startToRequestBoardData(getBoardReportRequestBody())
  }, [])

  return (
    <>
      <StyledMetricsSection>
        <ReportTitle title={REPORT_PAGE.BOARD.TITLE} />
        <ReportGrid reportDetails={getBoardItems()} />
      </StyledMetricsSection>
    </>
  )
}

export default BoardMetrics
