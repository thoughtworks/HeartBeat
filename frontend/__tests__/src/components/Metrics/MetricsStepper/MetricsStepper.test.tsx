import { act, fireEvent, render, screen } from '@testing-library/react'
import { exportToJsonFile } from '@src/utils/util'
import MetricsStepper from '@src/components/Metrics/MetricsStepper'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'
import {
  BACK,
  CONFIRM_DIALOG_DESCRIPTION,
  LEAD_TIME_FOR_CHANGES,
  MOCK_REPORT_URL,
  NEXT,
  PROJECT_NAME_LABEL,
  SAVE,
  STEPS,
  TEST_PROJECT_NAME,
  VELOCITY,
} from '../../../fixtures'
import userEvent from '@testing-library/user-event'
import {
  updateBoardVerifyState,
  updateMetrics,
  updatePipelineToolVerifyState,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice'
import dayjs from 'dayjs'
import { navigateMock } from '../../../../setupTests'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { HttpStatusCode } from 'axios'

const START_DATE_LABEL = 'From *'
const TODAY = dayjs()
const INPUT_DATE_VALUE = TODAY.format('MM/DD/YYYY')
const END_DATE_LABEL = 'To *'
const YES = 'Yes'
const CANCEL = 'Cancel'
const METRICS = 'Metrics'
const REPORT = 'Report'
const stepperColor = 'rgba(0, 0, 0, 0.87)'

const mockValidationCheckContext = {
  errorMessages: [],
  clearErrorMessage: jest.fn(),
  checkDuplicatedPipeLine: jest.fn(),
  isPipelineValid: jest.fn().mockReturnValue(true),
}

jest.mock('@src/hooks/useMetricsStepValidationCheckContext', () => ({
  useMetricsStepValidationCheckContext: () => mockValidationCheckContext,
}))

jest.mock('@src/utils/util', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exportToJsonFile: jest.fn((_filename: string, _json: object) => {
    //Mock for test
  }),
}))

const server = setupServer(rest.post(MOCK_REPORT_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok))))

const mockLocation = { reload: jest.fn() }
Object.defineProperty(window, 'location', { value: mockLocation })

let store = setupStore()
const fillConfigPageData = async () => {
  const projectNameInput = screen.getByRole('textbox', { name: PROJECT_NAME_LABEL })
  await userEvent.type(projectNameInput, TEST_PROJECT_NAME)

  const startDateInput = screen.getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
  fireEvent.change(startDateInput, { target: { value: INPUT_DATE_VALUE } })
  await act(async () => {
    await store.dispatch(updateMetrics([VELOCITY, LEAD_TIME_FOR_CHANGES]))
    await store.dispatch(updateBoardVerifyState(true))
    await store.dispatch(updatePipelineToolVerifyState(true))
    await store.dispatch(updateSourceControlVerifyState(true))
  })
}

const fillMetricsData = async () => {
  await act(async () => {
    await store.dispatch(updateMetrics([VELOCITY, LEAD_TIME_FOR_CHANGES]))
  })
}

describe('MetricsStepper', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())
  beforeEach(() => {
    store = setupStore()
  })
  afterEach(() => {
    navigateMock.mockClear()
  })
  const setup = () =>
    render(
      <Provider store={store}>
        <MetricsStepper />
      </Provider>
    )
  it('should show metrics stepper', () => {
    const { getByText } = setup()

    STEPS.map((label) => {
      expect(getByText(label)).toBeInTheDocument()
    })

    expect(getByText(NEXT)).toBeInTheDocument()
    expect(getByText(BACK)).toBeInTheDocument()
  })

  it('should show metrics config step when click back button given config step ', async () => {
    const { getByText } = setup()

    await userEvent.click(getByText(BACK))

    expect(getByText(PROJECT_NAME_LABEL)).toBeInTheDocument()
  })

  it('should show confirm dialog when click back button in config page', async () => {
    const { getByText } = setup()

    await userEvent.click(getByText(BACK))

    expect(getByText(CONFIRM_DIALOG_DESCRIPTION)).toBeInTheDocument()
  })

  it('should close confirm dialog when click cancel button', async () => {
    const { getByText, queryByText } = setup()

    await userEvent.click(getByText(BACK))
    await userEvent.click(getByText(CANCEL))

    expect(queryByText(CONFIRM_DIALOG_DESCRIPTION)).not.toBeInTheDocument()
  })

  it('should go to home page when click Yes button', async () => {
    const { getByText } = setup()

    await userEvent.click(getByText(BACK))

    expect(getByText(YES)).toBeVisible()

    await userEvent.click(getByText(YES))

    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('/home')
  })

  it('should disable next when required data is empty ', async () => {
    const { getByText } = setup()
    await act(async () => {
      await store.dispatch(updateMetrics([]))
    })

    expect(getByText(NEXT)).toBeDisabled()
  })

  it('should disable next when dataRange is empty ', async () => {
    const { getByText, getByRole } = setup()
    await fillConfigPageData()

    const startDateInput = getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement

    await userEvent.clear(startDateInput)
    await userEvent.clear(endDateInput)

    expect(getByText(NEXT)).toBeDisabled()
  })

  it('should disable next when endDate is empty ', async () => {
    const { getByText, getByRole } = setup()
    await fillConfigPageData()

    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement

    await userEvent.clear(endDateInput)

    expect(getByText(NEXT)).toBeDisabled()
  })

  it('should enable next when every selected component is show and verified', async () => {
    const { getByText } = setup()
    await fillConfigPageData()

    expect(getByText(NEXT)).toBeEnabled()
  })

  it('should disable next when board component is exist but not verified successfully', async () => {
    const { getByText } = setup()
    await act(async () => {
      await store.dispatch(updateMetrics([VELOCITY]))
      await store.dispatch(updateBoardVerifyState(false))
    })

    expect(getByText(NEXT)).toBeDisabled()
  })

  it('should go metrics page when click next button given next button enabled', async () => {
    const { getByText } = setup()

    await fillConfigPageData()
    await userEvent.click(getByText(NEXT))

    expect(getByText(METRICS)).toHaveStyle(`color:${stepperColor}`)
  })

  it('should show metrics export step when click next button given export step', async () => {
    const { getByText } = setup()
    await fillConfigPageData()
    await userEvent.click(getByText(NEXT))
    await userEvent.click(getByText(NEXT))

    expect(getByText(REPORT)).toHaveStyle(`color:${stepperColor}`)
  })

  it('should export json when click save button', async () => {
    const expectedFileName = 'config'
    const expectedJson = {
      board: undefined,
      calendarType: 'Regular Calendar(Weekend Considered)',
      dateRange: {
        endDate: null,
        startDate: null,
      },
      metrics: [],
      pipelineTool: undefined,
      projectName: '',
      sourceControl: undefined,
    }
    const { getByText } = setup()

    await userEvent.click(getByText(SAVE))

    expect(exportToJsonFile).toHaveBeenCalledWith(expectedFileName, expectedJson)
  })

  it('should export json when click save button when pipelineTool, sourceControl, and board is not empty', async () => {
    const expectedFileName = 'config'
    const expectedJson = {
      board: { boardId: '', email: '', projectKey: '', site: '', token: '', type: 'Jira' },
      calendarType: 'Regular Calendar(Weekend Considered)',
      dateRange: {
        endDate: null,
        startDate: null,
      },
      metrics: ['Velocity', 'Lead time for changes'],
      pipelineTool: { type: 'BuildKite', token: '' },
      projectName: '',
      sourceControl: { type: 'GitHub', token: '' },
    }

    const { getByText } = setup()
    await fillMetricsData()

    await userEvent.click(getByText(SAVE))

    expect(exportToJsonFile).toHaveBeenCalledWith(expectedFileName, expectedJson)
  })
})
