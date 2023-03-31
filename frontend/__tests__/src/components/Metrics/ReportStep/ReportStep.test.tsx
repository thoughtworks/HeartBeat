import { render, waitFor } from '@testing-library/react'
import { ReportStep } from '@src/components/Metrics/ReportStep'
import { REQUIRED_DATA_LIST } from '../../../fixtures'

jest.mock('@src/hooks/useGenerateReportEffect', () => ({
  useGenerateReportEffect: () => ({
    generateReport: jest.fn(() =>
      Promise.resolve({ response: { velocity: { velocityForSP: '3', velocityForCards: '4' } } })
    ),
    isLoading: false,
  }),
}))
describe('Export Step', () => {
  const setup = () => render(<ReportStep />)
  it('should render export page', async () => {
    const { getByText } = setup()

    await waitFor(() => {
      expect(getByText(REQUIRED_DATA_LIST[0])).toBeInTheDocument()
    })
  })

  it('should renders the velocity component with correct props', async () => {
    const { getByText } = setup()

    await waitFor(() => {
      expect(getByText('3')).toBeInTheDocument()
      expect(getByText('4')).toBeInTheDocument()
    })
  })
})
