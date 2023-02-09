import { fireEvent, render, waitFor, within } from '@testing-library/react'
import { Board } from '@src/components/metrics/ConfigStep/Board'
import { BOARD_TYPES } from '../../../fixtures'

describe('Board', () => {
  it('should show board title when render board component ', () => {
    const { getByRole } = render(<Board />)

    expect(getByRole('heading', { name: 'board' })).toBeInTheDocument()
  })
  it('should show default value jira when init board component', () => {
    const { getByText, queryByText } = render(<Board />)
    const boardType = getByText(BOARD_TYPES.JIRA)

    expect(boardType).toBeInTheDocument()

    const option = queryByText(BOARD_TYPES.CLASSIC_JIRA)
    expect(option).not.toBeTruthy()
  })
  it('should show detail options when click board field', () => {
    const { getByRole } = render(<Board />)
    fireEvent.mouseDown(getByRole('button', { name: 'board' }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(Object.values(BOARD_TYPES))
  })
  it('should show different board type when select different board field value ', async () => {
    const { getByRole, getByText } = render(<Board />)

    fireEvent.mouseDown(getByRole('button', { name: 'board' }))
    fireEvent.click(getByText(BOARD_TYPES.CLASSIC_JIRA))

    await waitFor(() => {
      expect(getByText(BOARD_TYPES.CLASSIC_JIRA)).toBeInTheDocument()
    })

    fireEvent.mouseDown(getByRole('button', { name: 'board' }))
    fireEvent.click(getByText(BOARD_TYPES.LINEAR))

    await waitFor(() => {
      expect(getByText(BOARD_TYPES.LINEAR)).toBeInTheDocument()
    })
  })
})
