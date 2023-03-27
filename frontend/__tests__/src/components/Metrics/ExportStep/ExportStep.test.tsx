import { render } from '@testing-library/react'
import { ExportStep } from '@src/components/Metrics/ExportStep'
import { REQUIRED_DATA_LIST } from '../../../fixtures'

describe('Export Step', () => {
  const setup = () => render(<ExportStep />)
  it('should render export page', async () => {
    const { getByText } = setup()

    expect(getByText(REQUIRED_DATA_LIST[0])).toBeInTheDocument()
  })
})
