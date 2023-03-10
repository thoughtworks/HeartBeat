import { render } from '@testing-library/react'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'
import { CYCLETIME_LIST } from '@src/constants'
import userEvent from '@testing-library/user-event'

const title = 'Cycle Time Settings'
const FlagAsBlock = 'Consider the "Flag" as "Block"'
const setup = () => render(<CycleTime title={title} options={CYCLETIME_LIST} />)

describe('CycleTime', () => {
  describe('CycleTime Title', () => {
    it('should show Cycle Time title when render Crews component', () => {
      const { getByText } = setup()
      expect(getByText(title)).toBeInTheDocument()
    })
  })

  describe('CycleTime Flag as Block', () => {
    it('should show FlagAsBlock when render Crews component', () => {
      const { getByText } = setup()
      expect(getByText(FlagAsBlock)).toBeInTheDocument()
    })

    it('should be checked by default when initializing', () => {
      const { getByRole } = setup()
      expect(getByRole('checkbox')).toHaveProperty('checked', true)
    })

    it('should change checked when click', async () => {
      const { getByRole } = setup()
      await userEvent.click(getByRole('checkbox'))
      expect(getByRole('checkbox')).toHaveProperty('checked', false)
      await userEvent.click(getByRole('checkbox'))
      expect(getByRole('checkbox')).toHaveProperty('checked', true)
    })
  })
})
