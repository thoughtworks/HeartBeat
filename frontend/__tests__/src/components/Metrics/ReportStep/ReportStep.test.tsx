import { render, waitFor } from '@testing-library/react'
import { ReportStep } from '@src/components/Metrics/ReportStep'
import { REQUIRED_DATA_LIST } from '../../../fixtures'
import { setupStore } from '../../../utils/setupStoreUtil'
import { Provider } from 'react-redux'

jest.mock('@src/hooks/useGenerateReportEffect', () => ({
  useGenerateReportEffect: () => ({
    generateReport: jest.fn(() =>
      Promise.resolve({
        response: {
          velocity: { velocityForSP: '3', velocityForCards: '4' },
          cycleTime: {
            averageCircleTimePerCard: '30.26',
            averageCycleTimePerSP: '21.18',
            totalTimeForCards: 423,
            swimlaneList: [
              {
                optionalItemName: 'Waiting for testing',
                averageTimeForSP: '0.16',
                averageTimeForCards: '0.23',
                totalTime: '3.21',
              },
            ],
          },
          classification: [
            {
              fieldName: '',
              pairs: [],
            },
          ],
        },
      })
    ),
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
      expect(getByText('3')).toBeInTheDocument()
      expect(getByText('4')).toBeInTheDocument()
    })
  })

  it('should renders the CycleTime component with correct props', async () => {
    const { getByText } = setup()

    await waitFor(() => {
      expect(getByText('30.26(days/card)')).toBeInTheDocument()
      expect(getByText('21.18(days/SP)')).toBeInTheDocument()
      expect(getByText('0.16(days/SP)')).toBeInTheDocument()
      expect(getByText('0.23(days/card)')).toBeInTheDocument()
    })
  })
})
