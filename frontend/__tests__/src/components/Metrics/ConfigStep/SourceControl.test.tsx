import { setupStore } from '../../../utils/setupStoreUtil'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { SourceControl } from '@src/components/Metrics/ConfigStep/SourceControl'
import {
  CONFIG_TITLE,
  ERROR_MESSAGE_COLOR,
  MOCK_SOURCE_CONTROL_URL,
  RESET,
  SOURCE_CONTROL_FIELDS,
  SOURCE_CONTROL_TYPES,
  TOKEN_ERROR_MESSAGE,
  VERIFIED,
  VERIFY,
  VERIFY_ERROR_MESSAGE,
  VERIFY_FAILED,
} from '../../../fixtures'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { HttpStatusCode } from 'axios'

export const fillSourceControlFieldsInformation = () => {
  const mockInfo = 'ghpghoghughsghr_1A2b1A2b1A2b1A2b1A2b1A2b1A2b1A2b1A2b'
  const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement

  fireEvent.change(tokenInput, { target: { value: mockInfo } })

  expect(tokenInput.value).toEqual(mockInfo)
}

let store = null

const server = setupServer(
  rest.get(MOCK_SOURCE_CONTROL_URL, (req, res, ctx) =>
    res(
      ctx.json({
        githubRepos: ['https://github.com/xxxx1/repo1', 'https://github.com/xxxx1/repo2'],
      }),
      ctx.status(200)
    )
  )
)

describe('SourceControl', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())
  store = setupStore()
  const setup = () => {
    store = setupStore()
    return render(
      <Provider store={store}>
        <SourceControl />
      </Provider>
    )
  }
  afterEach(() => {
    store = null
  })

  it('should show sourceControl title and fields when render sourceControl component', () => {
    const { getByLabelText, getAllByText } = setup()

    expect(getAllByText(CONFIG_TITLE.SOURCE_CONTROL)[0]).toBeInTheDocument()
    SOURCE_CONTROL_FIELDS.map((field) => {
      expect(getByLabelText(`${field} *`)).toBeInTheDocument()
    })
  })

  it('should show default value gitHub when init sourceControl component', () => {
    const { getByText } = setup()
    const sourceControlType = getByText(SOURCE_CONTROL_TYPES.GITHUB)

    expect(sourceControlType).toBeInTheDocument()
  })

  it('should clear all fields information when click reset button', async () => {
    const { getByRole, getByText, queryByRole } = setup()
    const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement

    fillSourceControlFieldsInformation()

    fireEvent.click(getByText(VERIFY))

    await waitFor(() => {
      expect(getByRole('button', { name: RESET })).toBeTruthy()
      fireEvent.click(getByRole('button', { name: RESET }))
    })

    expect(tokenInput.value).toEqual('')
    expect(getByText(SOURCE_CONTROL_TYPES.GITHUB)).toBeInTheDocument()
    expect(queryByRole('button', { name: RESET })).not.toBeTruthy()
    expect(getByRole('button', { name: VERIFY })).toBeDisabled()
  })

  it('should enable verify button when all fields checked correctly given disable verify button', () => {
    const { getByRole } = setup()
    const verifyButton = getByRole('button', { name: VERIFY })

    expect(verifyButton).toBeDisabled()

    fillSourceControlFieldsInformation()

    expect(verifyButton).toBeEnabled()
  })

  it('should show reset button and verified button when verify successfully', async () => {
    const { getByText } = setup()
    fillSourceControlFieldsInformation()

    fireEvent.click(getByText(VERIFY))

    await waitFor(() => {
      expect(getByText(RESET)).toBeTruthy()
    })

    await waitFor(() => {
      expect(getByText(VERIFIED)).toBeTruthy()
    })
  })

  it('should show error message and error style when token is empty', () => {
    const { getByText } = setup()

    fillSourceControlFieldsInformation()

    const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement

    fireEvent.change(tokenInput, { target: { value: '' } })

    expect(getByText(TOKEN_ERROR_MESSAGE[1])).toBeInTheDocument()
    expect(getByText(TOKEN_ERROR_MESSAGE[1])).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should show error message and error style when token is invalid', () => {
    const { getByText } = setup()
    const mockInfo = 'mockToken'
    const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement

    fireEvent.change(tokenInput, { target: { value: mockInfo } })

    expect(tokenInput.value).toEqual(mockInfo)
    expect(getByText(TOKEN_ERROR_MESSAGE[0])).toBeInTheDocument()
    expect(getByText(TOKEN_ERROR_MESSAGE[0])).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should show error notification when sourceControl verify response status is 401', async () => {
    server.use(
      rest.get(MOCK_SOURCE_CONTROL_URL, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.Unauthorized), ctx.json({ hintInfo: VERIFY_ERROR_MESSAGE.UNAUTHORIZED }))
      )
    )
    const { getByText, getByRole } = setup()

    fillSourceControlFieldsInformation()

    fireEvent.click(getByRole('button', { name: VERIFY }))

    await waitFor(() => {
      expect(
        getByText(`${SOURCE_CONTROL_TYPES.GITHUB} ${VERIFY_FAILED}: ${VERIFY_ERROR_MESSAGE.UNAUTHORIZED}`)
      ).toBeInTheDocument()
    })
  })
})
