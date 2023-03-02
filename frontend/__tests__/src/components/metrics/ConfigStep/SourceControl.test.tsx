import { setupStore } from '../../../utils/setupStoreUtil'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { SourceControl } from '@src/components/Metrics/ConfigStep/SourceControl'
import { CONFIG_TITLE, ERROR_MESSAGE_COLOR, SOURCE_CONTROL_FIELDS, SOURCE_CONTROL_TYPES } from '../../../fixtures'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

export const fillSourceControlFieldsInformation = () => {
  const mockInfo = 'mockToken'
  const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement
  fireEvent.change(tokenInput, { target: { value: mockInfo } })
  expect(tokenInput.value).toEqual(mockInfo)
}

let store = setupStore()
const setup = () => {
  store = setupStore()
  return render(
    <Provider store={store}>
      <SourceControl />
    </Provider>
  )
}

const server = setupServer(
  rest.get('/api/v1/codebase/fetch/repos', (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

describe('SourceControl', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())
  it('should show sourceControl title and fields when render sourceControl component', () => {
    const { getByRole, getByLabelText } = setup()

    expect(getByRole('heading', { name: CONFIG_TITLE.SOURCE_CONTROL })).toBeInTheDocument()
    SOURCE_CONTROL_FIELDS.map((field) => {
      expect(getByLabelText(`${field} *`)).toBeInTheDocument()
    })
  })

  it('should show default value gitHub when init sourceControl component', () => {
    const { getByText } = setup()
    const sourceControlType = getByText(SOURCE_CONTROL_TYPES.GIT_HUB)

    expect(sourceControlType).toBeInTheDocument()
  })

  it('should clear all fields information when click reset button', async () => {
    const { getByRole, getByText, queryByRole } = setup()
    const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement
    fillSourceControlFieldsInformation()

    fireEvent.click(getByText('Verify'))

    await waitFor(() => {
      expect(getByRole('button', { name: 'Reset' })).toBeInTheDocument()
      fireEvent.click(getByRole('button', { name: 'Reset' }))
    })

    expect(tokenInput.value).toEqual('')
    expect(getByText(SOURCE_CONTROL_TYPES.GIT_HUB)).toBeInTheDocument()
    expect(queryByRole('button', { name: 'Reset' })).not.toBeTruthy()
    expect(queryByRole('button', { name: 'Verify' })).toBeDisabled()
  })

  it('should enable verify button when all fields checked correctly given disable verify button', () => {
    const { getByRole } = setup()
    const verifyButton = getByRole('button', { name: 'Verify' })

    expect(verifyButton).toBeDisabled()

    fillSourceControlFieldsInformation()
    expect(verifyButton).toBeEnabled()
  })

  it('should show reset button  and verified button when verify successfully', async () => {
    const { getByText } = setup()
    fillSourceControlFieldsInformation()
    fireEvent.click(getByText('Verify'))
    await waitFor(() => {
      expect(getByText('Reset')).toBeVisible()
    })
    await waitFor(() => {
      expect(getByText('Verified')).toBeInTheDocument()
    })
  })

  it('should show error message and error style when token is empty', () => {
    const { getByText } = setup()
    const TOKEN_ERROR_MESSAGE = 'token is required'
    fillSourceControlFieldsInformation()

    const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement
    fireEvent.change(tokenInput, { target: { value: '' } })
    expect(getByText(TOKEN_ERROR_MESSAGE)).toBeVisible()
    expect(getByText(TOKEN_ERROR_MESSAGE)).toHaveStyle(ERROR_MESSAGE_COLOR)
  })
})
