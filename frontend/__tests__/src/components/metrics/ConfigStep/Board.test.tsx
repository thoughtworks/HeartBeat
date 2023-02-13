import { fireEvent, render, waitFor, within } from '@testing-library/react'
import { Board } from '@src/components/metrics/ConfigStep/Board'
import { BOARD_TYPES, ERROR_MESSAGE_COLOR } from '../../../fixtures'
import { BOARD_FIELDS } from '@src/constants'

describe('Board', () => {
  it('should show board title and fields when render board component ', () => {
    const { getByRole, getByLabelText } = render(<Board />)

    BOARD_FIELDS.map((field) => {
      expect(getByLabelText(`${field} *`)).toBeInTheDocument()
    })
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
  it('should show error message when input a wrong type email ', async () => {
    const { getByRole, getByText } = render(<Board />)
    const emailInput = getByRole('textbox', {
      name: 'email',
    })

    fireEvent.change(emailInput, { target: { value: 'wrong email type' } })

    await waitFor(() => {
      expect(getByText('email is required')).toBeVisible()
      expect(getByText('email is required')).toHaveStyle(ERROR_MESSAGE_COLOR)
    })
  })
  it('should clear other fields information when change board field selection', async () => {
    const { getByRole, getByText } = render(<Board />)
    const boardIdInput = getByRole('textbox', {
      name: 'boardId',
    }) as HTMLInputElement
    const emailInput = getByRole('textbox', {
      name: 'email',
    }) as HTMLInputElement

    fireEvent.change(boardIdInput, { target: { value: 2 } })
    fireEvent.change(emailInput, { target: { value: 'mockEmail@qq.com' } })
    fireEvent.mouseDown(getByRole('button', { name: 'board' }))
    fireEvent.click(getByText(BOARD_TYPES.CLASSIC_JIRA))

    await waitFor(() => {
      expect(emailInput.value).toEqual('')
      expect(boardIdInput.value).toEqual('')
    })
  })
})
