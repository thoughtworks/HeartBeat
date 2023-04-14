import { render, waitFor } from '@testing-library/react'
import { ReportStep } from '@src/components/Metrics/ReportStep'
import { EXPECTED_REPORT_VALUES, REQUIRED_DATA_LIST } from '../../../fixtures'
import { setupStore } from '../../../utils/setupStoreUtil'
import { Provider } from 'react-redux'

jest.mock('@src/hooks/useGenerateReportEffect', () => ({
  useGenerateReportEffect: () => ({
    generateReport: jest.fn(() => Promise.resolve(EXPECTED_REPORT_VALUES)),
    isLoading: false,
  }),
}))
let store = null

describe('Report Step', () => {
  store = setupStore()
  const setup = () => {
    store = setupStore()
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
    const { getByText } = setup()

    await waitFor(() => {
      expect(getByText(REQUIRED_DATA_LIST[1])).toBeInTheDocument()
      expect(getByText(REQUIRED_DATA_LIST[2])).toBeInTheDocument()
    })
  })

  it('should renders the velocity component with correct props', async () => {
    const { getByText } = setup()

    await waitFor(() => {
      expect(getByText('20')).toBeInTheDocument()
      expect(getByText('14')).toBeInTheDocument()
    })
  })

  it('should renders the CycleTime component with correct props', async () => {
    const { getByText } = setup()

    await waitFor(() => {
      expect(getByText('30.26(days/card)')).toBeInTheDocument()
      expect(getByText('21.18(days/SP)')).toBeInTheDocument()
    })
  })
})
