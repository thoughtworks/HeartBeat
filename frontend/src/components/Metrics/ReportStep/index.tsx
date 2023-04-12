import { Velocity } from '@src/components/Metrics/ReportStep/Velocity'
import { useEffect, useState } from 'react'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { Loading } from '@src/components/Loading'
import { useAppSelector } from '@src/hooks'
import { selectConfig } from '@src/context/config/configSlice'
import { reportResponseMapper } from '@src/mapper/ReportMapper'
import { INIT_CYCLETIME_METRICS, INIT_VELOCITY_METRICS } from '@src/constants'
import { CycleTimeReport } from '@src/components/Metrics/ReportStep/CycleTime'

export const ReportStep = () => {
  const { generateReport, isLoading } = useGenerateReportEffect()
  const [velocityData, setVelocityData] = useState(INIT_VELOCITY_METRICS)
  const [cycleTimeData, setCycleTimeData] = useState(INIT_CYCLETIME_METRICS)
  const configData = useAppSelector(selectConfig)
  const { metrics, calendarType, dateRange } = configData.basic
  const { board, pipelineTool, sourceControl } = configData
  const params = {
    metrics: metrics,
    pipeline: pipelineTool.config,
    board: board.config,
    sourceControl: sourceControl.config,
    calendarType: calendarType,
    startTime: dateRange.startDate,
    endTime: dateRange.endDate,
  }
  useEffect(() => {
    generateReport(params).then((res) => {
      if (res) {
        console.log(res.response.classification)
        const reportData = reportResponseMapper(res.response)
        setVelocityData(reportData.velocityValues)
        setCycleTimeData(reportData.cycleValues)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      {isLoading ? <Loading /> : <Velocity title={'Velocity'} velocityData={velocityData} />}
      <CycleTimeReport title={'Cycle Time'} cycleTimeData={cycleTimeData}></CycleTimeReport>
    </>
  )
}
