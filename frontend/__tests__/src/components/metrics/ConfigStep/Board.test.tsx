import { fireEvent, render, within, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer, SetupServerApi } from 'msw/node'
import { Board } from '@src/components/metrics/ConfigStep/Board'
import { BOARD_FIELDS, BOARD_TYPES, CONFIG_TITLE, ERROR_MESSAGE_COLOR } from '../../../fixtures'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'

export const fillBoardFieldsInformation = () => {
  const fields = ['boardId', 'email', 'projectKey', 'site', 'token']
  const mockInfo = ['2', 'mockEmail@qq.com', 'mockKey', '1', 'mockToken']
  const fieldInputs = fields.map(
    (label) =>
      screen.getByRole('textbox', {
        name: label,
        hidden: true,
      }) as HTMLInputElement
  )
  fieldInputs.map((input, index) => {
    fireEvent.change(input, { target: { value: mockInfo[index] } })
  })
  fieldInputs.map((input, index) => {
    expect(input.value).toEqual(mockInfo[index])
  })
}

let store = setupStore()
const setup = () => {
  store = setupStore()
  return render(
    <Provider store={store}>
      <Board />
    </Provider>
  )
}

describe('Board', () => {
  let server: SetupServerApi
  beforeEach(() => {
    server = setupServer(
      rest.get('/api/v1/board/jira', (req, res, ctx) => {
        return res(ctx.status(200, 'success'))
      })
    )
    server.listen()
  })

  afterAll(() => server.close())

  it('should show board title and fields when render board component ', () => {
    const { getByRole, getByLabelText } = setup()

    BOARD_FIELDS.map((field) => {
      expect(getByLabelText(`${field} *`)).toBeInTheDocument()
    })
    expect(getByRole('heading', { name: CONFIG_TITLE.BOARD })).toBeInTheDocument()
  })
  it('should show default value jira when init board component', () => {
    const { getByText, queryByText } = setup()
    const boardType = getByText(BOARD_TYPES.JIRA)

    expect(boardType).toBeInTheDocument()

    const option = queryByText(BOARD_TYPES.CLASSIC_JIRA)
    expect(option).not.toBeTruthy()
  })
  it('should show detail options when click board field', () => {
    const { getByRole } = setup()
    fireEvent.mouseDown(getByRole('button', { name: 'board' }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(Object.values(BOARD_TYPES))
  })
  it('should show different board type when select different board field value ', () => {
    const { getByRole, getByText } = setup()

    fireEvent.mouseDown(getByRole('button', { name: 'board' }))
    fireEvent.click(getByText(BOARD_TYPES.CLASSIC_JIRA))

    expect(getByText(BOARD_TYPES.CLASSIC_JIRA)).toBeInTheDocument()

    fireEvent.mouseDown(getByRole('button', { name: 'board' }))
    fireEvent.click(getByText(BOARD_TYPES.LINEAR))

    expect(getByText(BOARD_TYPES.LINEAR)).toBeInTheDocument()
  })
  it('should show error message when input a wrong type email ', () => {
    const { getByRole, getByText } = setup()
    const EMAil_ERROR_MESSAGE = 'email is required'
    const emailInput = getByRole('textbox', {
      name: 'email',
    })

    fireEvent.change(emailInput, { target: { value: 'wrong type email' } })
    expect(getByText(EMAil_ERROR_MESSAGE)).toBeVisible()
    expect(getByText(EMAil_ERROR_MESSAGE)).toHaveStyle(ERROR_MESSAGE_COLOR)
  })
  it('should clear other fields information when change board field selection', () => {
    const { getByRole, getByText } = setup()
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

    expect(emailInput.value).toEqual('')
    expect(boardIdInput.value).toEqual('')
  })
  it('should clear all fields information when click reset button', () => {
    const { getByRole, getByText, queryByRole } = setup()
    const fieldInputs = BOARD_FIELDS.slice(1, 5).map(
      (label) =>
        screen.getByRole('textbox', {
          name: label,
          hidden: true,
        }) as HTMLInputElement
    )
    fillBoardFieldsInformation()

    fireEvent.click(getByText('Verify'))
    fireEvent.click(getByRole('button', { name: 'Reset' }))

    fieldInputs.map((input) => {
      expect(input.value).toEqual('')
    })
    expect(getByText(BOARD_TYPES.JIRA)).toBeInTheDocument()
    expect(queryByRole('button', { name: 'Reset' })).not.toBeTruthy()
    expect(queryByRole('button', { name: 'Verify' })).toBeDisabled()
  })
  it('should enabled verify button when all fields checked correctly given disable verify button', () => {
    const { getByRole } = setup()
    const verifyButton = getByRole('button', { name: 'Verify' })

    expect(verifyButton).toBeDisabled()

    fillBoardFieldsInformation()

    expect(verifyButton).toBeEnabled()
  })
  it('should show reset button when verify succeed ', () => {
    const { getByText } = setup()
    fillBoardFieldsInformation()

    fireEvent.click(getByText('Verify'))

    expect(getByText('Reset')).toBeVisible()
  })
  it('should called verifyBoard method once when click verify button', async () => {
    const { getByRole, getByText } = setup()
    fillBoardFieldsInformation()
    fireEvent.click(getByRole('button', { name: 'Verify' }))

    expect(getByText('Verified')).toBeInTheDocument()
  })
})
