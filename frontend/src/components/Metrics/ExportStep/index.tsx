import { Velocity } from '@src/components/Metrics/ExportStep/Velocity'
const velocityData = [
  {
    name: 'Velocity(SP)',
    value: 27,
  },
  {
    name: 'Throughput(Cards Count)',
    value: 10,
  },
]
export const ExportStep = () => {
  return (
    <>
      <Velocity title={'Velocity'} velocityData={velocityData} />
    </>
  )
}
