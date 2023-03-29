import { Velocity } from '@src/components/Metrics/ExportStep/Velocity'
import { useEffect, useState } from 'react'
import { useGeneratorReportEffect } from '@src/hooks/useGeneratorReportEffect'
import { Loading } from '@src/components/Loading'

export const ExportStep = () => {
  const { generatorReport, isLoading } = useGeneratorReportEffect()
  const [velocityData, setVelocityData] = useState({ velocityForSP: '2', velocityForCards: '2' })
  useEffect(() => {
    generatorReport().then((res) => {
      if (res) {
        setVelocityData(res.response?.velocity)
      }
    })
  }, [generatorReport])
  return (
    <>
      {isLoading && <Loading />}
      <Velocity title={'Velocity'} velocityData={velocityData} />
    </>
  )
}
