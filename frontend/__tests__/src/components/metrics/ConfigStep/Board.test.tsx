import { fireEvent, render, within, screen, waitFor } from '@testing-library/react'
import { Board } from '@src/components/Metrics/ConfigStep/Board'
import {
  BOARD_FIELDS,
  BOARD_TYPES,
  CONFIG_TITLE,
  ERROR_MESSAGE_COLOR,
  MOCK_BOARD_URL,
  REST_BUTTON,
  VERIFY_BUTTON,
  ERROR_MESSAGE,
} from '../../../fixtures'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

export const fillBoardFieldsInformation = () => {
  const fields = ['BoardId', 'Email', 'Project Key', 'Site', 'Token']
  const mockInfo = ['2', 'mockEmail@qq.com', 'mockKey', '1', 'mockToken']
  const fieldInputs = fields.map((label) => screen.getByTestId(label).querySelector('input') as HTMLInputElement)
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
const server = setupServer(
  rest.get(MOCK_BOARD_URL, (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

describe('Board', () => {
  beforeAll(() => server.listen())
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
    fireEvent.mouseDown(getByRole('button', { name: CONFIG_TITLE.BOARD }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(Object.values(BOARD_TYPES))
  })

  it('should show different board type when select different board field value ', async () => {
    const { getByRole, getByText } = setup()

    fireEvent.mouseDown(getByRole('button', { name: CONFIG_TITLE.BOARD }))
    fireEvent.click(getByText(BOARD_TYPES.CLASSIC_JIRA))

    await waitFor(() => {
      expect(getByText(BOARD_TYPES.CLASSIC_JIRA)).toBeInTheDocument()
    })

    fireEvent.mouseDown(getByRole('button', { name: CONFIG_TITLE.BOARD }))
    fireEvent.click(getByText(BOARD_TYPES.LINEAR))

    await waitFor(() => {
      expect(getByText(BOARD_TYPES.LINEAR)).toBeInTheDocument()
    })
  })

  it('should show error message when input a wrong type email ', async () => {
    const { getByTestId, getByText } = setup()
    const EMAil_ERROR_MESSAGE = 'Email is required'
    const emailInput = getByTestId('Email').querySelector('input') as HTMLInputElement

    fireEvent.change(emailInput, { target: { value: 'wrong type email' } })
    expect(getByText(EMAil_ERROR_MESSAGE)).toBeVisible()
    expect(getByText(EMAil_ERROR_MESSAGE)).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should clear other fields information when change board field selection', () => {
    const { getByRole, getByText } = setup()
    const boardIdInput = getByRole('textbox', {
      name: 'BoardId',
    }) as HTMLInputElement
    const emailInput = getByRole('textbox', {
      name: 'Email',
    }) as HTMLInputElement

    fireEvent.change(boardIdInput, { target: { value: 2 } })
    fireEvent.change(emailInput, { target: { value: 'mockEmail@qq.com' } })
    fireEvent.mouseDown(getByRole('button', { name: CONFIG_TITLE.BOARD }))
    fireEvent.click(getByText(BOARD_TYPES.CLASSIC_JIRA))

    expect(emailInput.value).toEqual('')
    expect(boardIdInput.value).toEqual('')
  })

  it('should clear all fields information when click reset button', async () => {
    const { getByRole, getByText, queryByRole } = setup()
    const fieldInputs = BOARD_FIELDS.slice(1, 5).map(
      (label) =>
        screen.getByRole('textbox', {
          name: label,
          hidden: true,
        }) as HTMLInputElement
    )
    fillBoardFieldsInformation()

    fireEvent.click(getByText(VERIFY_BUTTON))
    await waitFor(() => {
      fireEvent.click(getByRole('button', { name: REST_BUTTON }))
    })

    fieldInputs.map((input) => {
      expect(input.value).toEqual('')
    })
    expect(getByText(BOARD_TYPES.JIRA)).toBeInTheDocument()
    expect(queryByRole('button', { name: REST_BUTTON })).not.toBeTruthy()
    expect(queryByRole('button', { name: VERIFY_BUTTON })).toBeDisabled()
  })

  it('should enabled verify button when all fields checked correctly given disable verify button', () => {
    const { getByRole } = setup()
    const verifyButton = getByRole('button', { name: VERIFY_BUTTON })

    expect(verifyButton).toBeDisabled()

    fillBoardFieldsInformation()

    expect(verifyButton).toBeEnabled()
  })

  it('should show reset button when verify succeed ', async () => {
    const { getByText } = setup()
    fillBoardFieldsInformation()

    fireEvent.click(getByText(VERIFY_BUTTON))

    await waitFor(() => {
      expect(getByText(REST_BUTTON)).toBeVisible()
    })
  })

  it('should called verifyBoard method once when click verify button', async () => {
    const { getByRole, getByText } = setup()
    fillBoardFieldsInformation()
    fireEvent.click(getByRole('button', { name: VERIFY_BUTTON }))

    await waitFor(() => {
      expect(getByText('Verified')).toBeInTheDocument()
    })
  })

  it('should check loading animation when click verify button', async () => {
    const { getByRole, getByTestId } = setup()
    fillBoardFieldsInformation()
    fireEvent.click(getByRole('button', { name: VERIFY_BUTTON }))

    expect(getByTestId('circularProgress')).toBeVisible()

    setTimeout(() => {
      expect(getByTestId('circularProgress')).not.toBeVisible()
    }, 1000)
  })

  it('should check noDoneCardPop show and disappear when board verify response status is 204', async () => {
    server.use(rest.get(MOCK_BOARD_URL, (req, res, ctx) => res(ctx.status(204))))
    const { getByText, getByRole } = setup()
    fillBoardFieldsInformation()

    fireEvent.click(getByRole('button', { name: VERIFY_BUTTON }))

    await waitFor(() => {
      expect(getByText('Sorry there is no card has been done, please change your collection date!')).toBeInTheDocument()
    })

    fireEvent.click(getByRole('button', { name: 'Ok' }))
    expect(getByText('Sorry there is no card has been done, please change your collection date!')).not.toBeVisible()
  })
  it('should check error notification show and disappear when board verify response status is 404', async () => {
    server.use(rest.get(MOCK_BOARD_URL, (req, res, ctx) => res(ctx.status(404))))
    const { getByText, getByRole } = setup()
    fillBoardFieldsInformation()

    fireEvent.click(getByRole('button', { name: VERIFY_BUTTON }))

    await waitFor(() => {
      expect(getByText(ERROR_MESSAGE[404])).toBeInTheDocument()
    })
  })
})
