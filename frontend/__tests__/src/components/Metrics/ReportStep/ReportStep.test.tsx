import { act, render, waitFor } from '@testing-library/react'
import { ReportStep } from '@src/components/Metrics/ReportStep'
import { EXPECTED_REPORT_VALUES, REQUIRED_DATA_LIST } from '../../../fixtures'
import { setupStore } from '../../../utils/setupStoreUtil'
import { Provider } from 'react-redux'
import { updateDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice'
import { updatePipelineToolVerifyResponse } from '@src/context/config/configSlice'

jest.mock('@src/hooks/useGenerateReportEffect', () => ({
  useGenerateReportEffect: () => ({
    generateReport: jest.fn(() => Promise.resolve(EXPECTED_REPORT_VALUES)),
    isLoading: false,
  }),
}))
let store = null

describe('Report Step', () => {
  const setup = async () => {
    store = setupStore()
    await store.dispatch(
      updateDeploymentFrequencySettings({ updateId: 0, label: 'organization', value: 'mock organization' })
    )
    await store.dispatch(
      updateDeploymentFrequencySettings({ updateId: 0, label: 'pipelineName', value: 'mock pipeline name' })
    )
    await store.dispatch(updateDeploymentFrequencySettings({ updateId: 0, label: 'step', value: 'mock step1' }))
    await store.dispatch(
      updatePipelineToolVerifyResponse({
        pipelineList: [
          {
            orgId: 'mock organization id',
            orgName: 'mock organization',
            id: 'mock pipeline id',
            name: 'mock pipeline name',
            steps: ['mock step1', 'mock step2'],
            repository: 'mock url',
          },
        ],
      })
    )
    return render(
      <Provider store={store}>
        <ReportStep />
      </Provider>
    )
  }
  afterEach(() => {
    store = null
  })
  it('should render report page', async () => {
    const { getByText } = await act(() => setup())

    await waitFor(() => {
      expect(getByText(REQUIRED_DATA_LIST[1])).toBeInTheDocument()
      expect(getByText(REQUIRED_DATA_LIST[2])).toBeInTheDocument()
    })
  })

  it('should renders the velocity component with correct props', async () => {
    const { getByText } = await act(() => setup())

    await waitFor(() => {
      expect(getByText(20)).toBeInTheDocument()
      expect(getByText(14)).toBeInTheDocument()
    })
  })

  it('should renders the CycleTime component with correct props', async () => {
    const { getByText } = await act(() => setup())

    await waitFor(() => {
      expect(getByText('30.26(days/card)')).toBeInTheDocument()
      expect(getByText('21.18(days/SP)')).toBeInTheDocument()
      expect(getByText('0.57')).toBeInTheDocument()
      expect(getByText('12.13(days/SP)')).toBeInTheDocument()
    })
  })
})
