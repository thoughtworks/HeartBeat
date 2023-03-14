import { render } from '@testing-library/react'
import { PipelineMetricSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection'

jest.mock('@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection', () => ({
  SingleSelection: () => <div>mock SingleSelection</div>,
}))

const deploymentFrequencySetting = {
  organization: 'mock organization',
  pipelineName: 'mock pipelineName',
  steps: 'mock steps',
}

describe('PipelineMetricSelection', () => {
  it('should render PipelineMetricSelection', () => {
    const { getByText, getAllByText } = render(
      <PipelineMetricSelection deploymentFrequencySetting={deploymentFrequencySetting} />
    )

    expect(getByText('Remove this pipeline')).toBeInTheDocument()
    expect(getAllByText('mock SingleSelection').length).toEqual(3)
  })
})
