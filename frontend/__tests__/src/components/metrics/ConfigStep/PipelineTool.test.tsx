import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { PipelineTool } from '@src/components/Metrics/ConfigStep/PipelineTool'
import {
  PIPELINE_TOOL_FIELDS,
  CONFIG_TITLE,
  PIPELINE_TOOL_TYPES,
  ERROR_MESSAGE_COLOR,
  MOCK_PIPELINE_URL,
  PIPELINE_TOOL_VERIFY_ERROR_MESSAGE,
  VERIFY,
  RESET,
} from '../../../fixtures'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { INVALID_TOKEN_MESSAGE } from '@src/constants'

export const fillPipelineToolFieldsInformation = () => {
  const mockInfo = 'mockTokenMockTokenMockTokenMockToken1234'
  const tokenInput = screen.getByTestId('pipelineToolTextField').querySelector('input') as HTMLInputElement
  fireEvent.change(tokenInput, { target: { value: mockInfo } })
  expect(tokenInput.value).toEqual(mockInfo)
}

let store = setupStore()
const setup = () => {
  store = setupStore()
  return render(
    <Provider store={store}>
      <PipelineTool />
    </Provider>
  )
}

const server = setupServer(
  rest.get(MOCK_PIPELINE_URL, (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

describe('PipelineTool', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should show pipelineTool title and fields when render pipelineTool component ', () => {
    const { getByRole, getByLabelText } = setup()

    PIPELINE_TOOL_FIELDS.map((field) => {
      expect(getByLabelText(`${field} *`)).toBeInTheDocument()
    })
    expect(getByRole('heading', { name: CONFIG_TITLE.PIPELINE_TOOL })).toBeInTheDocument()
  })

  it('should show default value buildKite when init pipelineTool component', () => {
    const { getByText, queryByText } = setup()
    const pipelineToolType = getByText(PIPELINE_TOOL_TYPES.BUILD_KITE)

    expect(pipelineToolType).toBeInTheDocument()

    const option = queryByText(PIPELINE_TOOL_TYPES.GO_CD)
    expect(option).not.toBeInTheDocument()
  })

  it('should clear other fields information when change pipelineTool Field selection', () => {
    const { getByRole, getByText } = setup()
    const tokenInput = screen.getByTestId('pipelineToolTextField').querySelector('input') as HTMLInputElement

    fireEvent.change(tokenInput, { target: { value: 'abcd' } })
    fireEvent.mouseDown(getByRole('button', { name: 'Pipeline Tool' }))
    fireEvent.click(getByText(PIPELINE_TOOL_TYPES.GO_CD))

    expect(tokenInput.value).toEqual('')
  })

  it('should clear all fields information when click reset button', async () => {
    const { getByRole, getByText, queryByRole } = setup()
    const tokenInput = screen.getByTestId('pipelineToolTextField').querySelector('input') as HTMLInputElement
    fillPipelineToolFieldsInformation()

    fireEvent.click(getByText(VERIFY))
    await waitFor(() => {
      fireEvent.click(getByRole('button', { name: RESET }))
    })

    expect(tokenInput.value).toEqual('')
    expect(getByText(PIPELINE_TOOL_TYPES.BUILD_KITE)).toBeInTheDocument()
    expect(queryByRole('button', { name: RESET })).not.toBeInTheDocument()
    expect(queryByRole('button', { name: VERIFY })).toBeDisabled()
  })

  it('should show detail options when click pipelineTool fields', () => {
    const { getByRole } = setup()
    fireEvent.mouseDown(getByRole('button', { name: 'Pipeline Tool' }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(Object.values(PIPELINE_TOOL_TYPES))
  })

  it('should enabled verify button when all fields checked correctly given disable verify button', () => {
    const { getByRole } = setup()
    const verifyButton = getByRole('button', { name: VERIFY })

    expect(verifyButton).toBeDisabled()

    fillPipelineToolFieldsInformation()

    expect(verifyButton).toBeEnabled()
  })

  it('should show error message and error style when token is empty', () => {
    const { getByText } = setup()
    fillPipelineToolFieldsInformation()

    const tokenInput = screen.getByTestId('pipelineToolTextField').querySelector('input') as HTMLInputElement
    fireEvent.change(tokenInput, { target: { value: '' } })
    expect(getByText(INVALID_TOKEN_MESSAGE)).toBeVisible()
    expect(getByText(INVALID_TOKEN_MESSAGE)).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should show reset button when verify succeed ', async () => {
    const { getByText } = setup()
    fillPipelineToolFieldsInformation()
    fireEvent.click(getByText(VERIFY))
    await waitFor(() => {
      expect(getByText(RESET)).toBeVisible()
    })
  })

  it('should called verifyPipelineTool method once when click verify button', async () => {
    const { getByRole, getByText } = setup()
    fillPipelineToolFieldsInformation()
    fireEvent.click(getByRole('button', { name: VERIFY }))
    await waitFor(() => {
      expect(getByText('Verified')).toBeInTheDocument()
    })
  })

  it('should check loading animation when click verify button', async () => {
    const { getByRole, getByTestId } = setup()
    fillPipelineToolFieldsInformation()
    fireEvent.click(getByRole('button', { name: VERIFY }))

    const circularProgress = getByTestId('circularProgress')

    expect(circularProgress).toBeVisible()

    await waitFor(() => {
      expect(circularProgress).not.toBeVisible()
    })
  })

  it('should check error notification show when pipelineTool verify response status is 404', async () => {
    server.use(rest.get(MOCK_PIPELINE_URL, (req, res, ctx) => res(ctx.status(404))))
    const { getByText, getByRole } = setup()
    fillPipelineToolFieldsInformation()

    fireEvent.click(getByRole('button', { name: VERIFY }))

    await waitFor(() => {
      expect(getByText(PIPELINE_TOOL_VERIFY_ERROR_MESSAGE[404])).toBeInTheDocument()
    })
  })

  it('should check error notification disappear when pipelineTool verify response status is 404', async () => {
    expect.assertions(2)
    server.use(rest.get(MOCK_PIPELINE_URL, (req, res, ctx) => res(ctx.status(404))))
    const { getByRole } = setup()
    fillPipelineToolFieldsInformation()

    fireEvent.click(getByRole('button', { name: VERIFY }))

    await waitFor(() => {
      expect(screen.queryByText(PIPELINE_TOOL_VERIFY_ERROR_MESSAGE[404])).not.toBeInTheDocument()
    })
  })
})
