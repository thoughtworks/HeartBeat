import React, { useEffect } from 'react'
import { useAppSelector } from '@src/hooks'
import { selectConfig, selectJiraColumns } from '@src/context/config/configSlice'
import {
  BOARD_METRICS,
  CALENDAR,
  METRICS_SUBTITLE,
  REPORT_PAGE,
  METRICS_TITLE,
  REQUIRED_DATA,
} from '@src/constants/resources'
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
  const boardMetrics = metrics.filter((metric) => BOARD_METRICS.includes(metric))

  const getBoardReportRequestBody = (): BoardReportRequestDTO => {
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

  const getBoardItems = () => {
    const velocity = boardReport?.velocity
    const cycleTime = boardReport?.cycleTime
    const velocityItems = boardMetrics.includes(REQUIRED_DATA.VELOCITY)
      ? [
          {
            title: METRICS_TITLE.VELOCITY,
            items: velocity && [
              {
                value: velocity.velocityForSP,
                subtitle: METRICS_SUBTITLE.VELOCITY,
                isToFixed: false,
              },
              {
                value: velocity.velocityForCards,
                subtitle: METRICS_SUBTITLE.THROUGHPUT,
                isToFixed: false,
              },
            ],
          },
        ]
      : []

    const cycleTimeItems = boardMetrics.includes(REQUIRED_DATA.CYCLE_TIME)
      ? [
          {
            title: METRICS_TITLE.CYCLE_TIME,
            items: cycleTime && [
              {
                value: cycleTime.averageCycleTimePerSP,
                subtitle: METRICS_SUBTITLE.AVERAGE_CYCLE_TIME_PRE_SP,
              },
              {
                value: cycleTime.averageCycleTimePerCard,
                subtitle: METRICS_SUBTITLE.AVERAGE_CYCLE_TIME_PRE_CARD,
              },
            ],
          },
        ]
      : []

    return [...velocityItems, ...cycleTimeItems]
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