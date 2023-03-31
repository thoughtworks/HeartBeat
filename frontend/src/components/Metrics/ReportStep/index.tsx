import { Velocity } from '@src/components/Metrics/ReportStep/Velocity'
import { useEffect, useState } from 'react'
import { useGeneratorReportEffect } from '@src/hooks/useGeneratorReportEffect'
import { Loading } from '@src/components/Loading'

export const ReportStep = () => {
  const { generatorReport, isLoading } = useGeneratorReportEffect()
  const [velocityData, setVelocityData] = useState({
    velocityForSP: '2',
    velocityForCards: '2',
  })
  useEffect(() => {
    generatorReport().then((res) => {
      if (res) {
        setVelocityData(res.response?.velocity)
      }
    })
  }, [])
  return (
    <>
      {isLoading && <Loading />}
      <Velocity title={'Velocity'} velocityData={velocityData} />
    </>
  )
}
