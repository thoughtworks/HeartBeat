import { Velocity } from '@src/components/Metrics/ReportStep/Velocity'
import { useEffect, useState } from 'react'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { Loading } from '@src/components/Loading'

export const ReportStep = () => {
  const { generateReport, isLoading } = useGenerateReportEffect()
  const [velocityData, setVelocityData] = useState({
    velocityForSP: '2',
    velocityForCards: '2',
  })
  useEffect(() => {
    generateReport().then((res) => {
      if (res) {
        setVelocityData(res.response?.velocity)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <>{isLoading ? <Loading /> : <Velocity title={'Velocity'} velocityData={velocityData} />}</>
}
