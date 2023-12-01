import { render, renderHook } from '@testing-library/react'
import ReportStep from '@src/components/Metrics/ReportStep'
import {
  BACK,
  ERROR_PAGE_ROUTE,
  EXPECTED_REPORT_VALUES,
  EXPORT_BOARD_DATA,
  EXPORT_METRIC_DATA,
  EXPORT_PIPELINE_DATA,
  MOCK_JIRA_VERIFY_RESPONSE,
  REQUIRED_DATA_LIST,
} from '../../../fixtures'
import { setupStore } from '../../../utils/setupStoreUtil'
import { Provider } from 'react-redux'
import { updateDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice'
import {
  updateJiraVerifyResponse,
  updateMetrics,
  updatePipelineToolVerifyResponse,
} from '@src/context/config/configSlice'
import userEvent from '@testing-library/user-event'
import { backStep } from '@src/context/stepper/StepperSlice'
import { navigateMock } from '../../../../setupTests'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect'
import { HEADER_NOTIFICATION_MESSAGE } from '@src/constants'
import React from 'react'
import { useExportCsvEffect } from '@src/hooks/useExportCsvEffect'

jest.mock('@src/context/stepper/StepperSlice', () => ({
  ...jest.requireActual('@src/context/stepper/StepperSlice'),
  backStep: jest.fn().mockReturnValue({ type: 'BACK_STEP' }),
}))

jest.mock('@src/hooks/useExportCsvEffect', () => ({
  useExportCsvEffect: jest.fn().mockReturnValue({
    fetchExportData: jest.fn(),
    errorMessage: 'failed export csv',
    isExpired: false,
  }),
}))

jest.mock('@src/hooks/useGenerateReportEffect', () => ({
  useGenerateReportEffect: jest.fn().mockReturnValue({
    startPollingReports: jest.fn(),
    stopPollingReports: jest.fn(),
    isLoading: false,
    isServerError: false,
    errorMessage: '',
  }),
}))

jest.mock('@src/emojis/emoji', () => ({
  getEmojiUrls: jest.fn().mockReturnValue(['']),
  removeExtraEmojiName: jest.fn(),
}))

jest.mock('@src/utils/util', () => ({
  transformToCleanedBuildKiteEmoji: jest.fn(),
  getJiraBoardToken: jest.fn(),
}))

let store = null
describe('Report Step', () => {
  const { result: notificationHook } = renderHook(() => useNotificationLayoutEffect())
  const { result: reportHook } = renderHook(() => useGenerateReportEffect())
  beforeEach(() => {
    resetReportHook()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })
  const resetReportHook = async () => {
    reportHook.current.startPollingReports = jest.fn()
    reportHook.current.stopPollingReports = jest.fn()
    reportHook.current.isLoading = false
    reportHook.current.isServerError = false
    reportHook.current.errorMessage = ''
    reportHook.current.reports = EXPECTED_REPORT_VALUES
  }
  const setup = (params: [string]) => {
    store = setupStore()
    store.dispatch(
      updateJiraVerifyResponse({
        jiraColumns: MOCK_JIRA_VERIFY_RESPONSE.jiraColumns,
        targetFields: MOCK_JIRA_VERIFY_RESPONSE.targetFields,
        users: MOCK_JIRA_VERIFY_RESPONSE.users,
      })
    )
    store.dispatch(updateMetrics(params))
    store.dispatch(
      updateDeploymentFrequencySettings({ updateId: 0, label: 'organization', value: 'mock organization' })
    )
    store.dispatch(
      updateDeploymentFrequencySettings({ updateId: 0, label: 'pipelineName', value: 'mock pipeline name' })
    )
    store.dispatch(updateDeploymentFrequencySettings({ updateId: 0, label: 'step', value: 'mock step1' }))
    store.dispatch(
      updatePipelineToolVerifyResponse({
        pipelineList: [
          {
            orgId: 'mock organization id',
            orgName: 'mock organization',
            id: 'mock pipeline id',
            name: 'mock pipeline name',
            steps: ['mock step1', 'mock step2'],
            repository: 'mock url',
          },
        ],
      })
    )
    return render(
      <Provider store={store}>
        <ReportStep {...notificationHook.current} />
      </Provider>
    )
  }
  afterEach(() => {
    store = null
    jest.clearAllMocks()
  })

  it('should render report page', () => {
    const { getByText } = setup([''])

    expect(getByText(REQUIRED_DATA_LIST[1])).toBeInTheDocument()
    expect(getByText(REQUIRED_DATA_LIST[2])).toBeInTheDocument()
  })

  it('should renders the velocity component with correct props', () => {
    const { getByText } = setup([''])

    expect(getByText(20)).toBeInTheDocument()
    expect(getByText(14)).toBeInTheDocument()
  })

  it('should renders the CycleTime component with correct props', () => {
    const { getByText } = setup([''])

    expect(getByText('30.26(days/card)')).toBeInTheDocument()
    expect(getByText('21.18(days/SP)')).toBeInTheDocument()
    expect(getByText('57.25%')).toBeInTheDocument()
    expect(getByText('12.13(days/SP)')).toBeInTheDocument()
  })

  it('should call handleBack method when click back button given back button enabled', async () => {
    const { getByText } = setup([''])
    const back = getByText(BACK)
    await userEvent.click(back)
    expect(backStep).toHaveBeenCalledTimes(1)
  })

  it('should not show export pipeline button when not select deployment frequency', () => {
    const { queryByText } = setup([REQUIRED_DATA_LIST[1]])
    const exportPipelineButton = queryByText(EXPORT_PIPELINE_DATA)
    expect(exportPipelineButton).not.toBeInTheDocument()
  })

  it.each([[REQUIRED_DATA_LIST[4]], [REQUIRED_DATA_LIST[5]], [REQUIRED_DATA_LIST[6]], [REQUIRED_DATA_LIST[7]]])(
    'should show export pipeline button when select %s',
    (requiredData) => {
      const { getByText } = setup([requiredData])
      const exportPipelineButton = getByText(EXPORT_PIPELINE_DATA)
      expect(exportPipelineButton).toBeInTheDocument()
    }
  )

  it('should show errorMessage when generateReport has error message', () => {
    reportHook.current.errorMessage = 'error message'
    const { getByText } = setup([''])
    expect(getByText('error message')).toBeInTheDocument()
  })

  it('should show errorMessage when click export pipeline button given csv not exist', () => {
    const { getByText } = setup([REQUIRED_DATA_LIST[4]])
    userEvent.click(getByText(EXPORT_PIPELINE_DATA))
    expect(getByText('failed export csv')).toBeInTheDocument()
  })

  describe('export board data', () => {
    it('should not show export board button when not select board metrics', () => {
      const { queryByText } = setup([REQUIRED_DATA_LIST[4]])
      const exportPipelineButton = queryByText(EXPORT_BOARD_DATA)
      expect(exportPipelineButton).not.toBeInTheDocument()
    })

    it.each([[REQUIRED_DATA_LIST[1]], [REQUIRED_DATA_LIST[2]], [REQUIRED_DATA_LIST[3]]])(
      'should show export board button when select %s',
      (requiredData) => {
        const { getByText } = setup([requiredData])
        const exportPipelineButton = getByText(EXPORT_BOARD_DATA)
        expect(exportPipelineButton).toBeInTheDocument()
      }
    )

    it('should show errorMessage when click export board button given csv not exist', () => {
      const { getByText } = setup([REQUIRED_DATA_LIST[1]])
      userEvent.click(getByText(EXPORT_BOARD_DATA))
      expect(getByText('failed export csv')).toBeInTheDocument()
    })
  })

  it('should show errorMessage when click export metric button given csv not exist', () => {
    const { getByText } = setup([''])
    userEvent.click(getByText(EXPORT_METRIC_DATA))
    expect(getByText('Export metric data')).toBeInTheDocument()
  })

  it('should show export metric button when visiting this page', () => {
    const { getByText } = setup([''])
    const exportMetricButton = getByText(EXPORT_METRIC_DATA)
    expect(exportMetricButton).toBeInTheDocument()
  })

  it('should check error page show when isReportError is true', () => {
    reportHook.current.isServerError = true
    reportHook.current.errorMessage = 'error message'

    setup([REQUIRED_DATA_LIST[1]])

    expect(navigateMock).toHaveBeenCalledWith(ERROR_PAGE_ROUTE)
  })

  it('should render loading page when isLoading is true', () => {
    reportHook.current.isLoading = true

    const { getByTestId } = setup([''])

    expect(getByTestId('loading-page')).toBeInTheDocument()
  })

  it('should call resetProps and updateProps when remaining time is less than or equal to 5 minutes', () => {
    const initExportValidityTimeMin = 30
    React.useState = jest.fn().mockReturnValue([
      initExportValidityTimeMin,
      () => {
        jest.fn()
      },
    ])
    const resetProps = jest.fn()
    const updateProps = jest.fn()
    notificationHook.current.resetProps = resetProps
    notificationHook.current.updateProps = updateProps
    jest.useFakeTimers()
    setup([''])

    expect(resetProps).not.toBeCalled()
    expect(updateProps).not.toBeCalledWith({
      open: true,
      title: HEADER_NOTIFICATION_MESSAGE.EXPIRE_IN_FIVE_MINUTES,
    })

    jest.advanceTimersByTime(500000)

    expect(updateProps).not.toBeCalledWith({
      open: true,
      title: HEADER_NOTIFICATION_MESSAGE.EXPIRE_IN_FIVE_MINUTES,
    })

    jest.advanceTimersByTime(1000000)

    expect(updateProps).toBeCalledWith({
      open: true,
      title: HEADER_NOTIFICATION_MESSAGE.EXPIRE_IN_FIVE_MINUTES,
    })

    jest.useRealTimers()
  })

  it('should call fetchExportData when clicking "Export metric data"', async () => {
    const { result } = renderHook(() => useExportCsvEffect())
    const { getByText } = setup([''])

    const exportButton = getByText(EXPORT_METRIC_DATA)
    expect(exportButton).toBeInTheDocument()
    await userEvent.click(exportButton)
    expect(result.current.fetchExportData).toBeCalled()
  })

  it('should call fetchExportData when clicking "Export board data"', async () => {
    const { result } = renderHook(() => useExportCsvEffect())
    const { getByText } = setup([REQUIRED_DATA_LIST[2]])

    const exportButton = getByText(EXPORT_BOARD_DATA)
    expect(exportButton).toBeInTheDocument()
    await userEvent.click(exportButton)
    expect(result.current.fetchExportData).toBeCalled()
  })

  it('should call fetchExportData when clicking "Export pipeline data"', async () => {
    const { result } = renderHook(() => useExportCsvEffect())
    const { getByText } = setup([REQUIRED_DATA_LIST[6]])

    const exportButton = getByText(EXPORT_PIPELINE_DATA)
    expect(exportButton).toBeInTheDocument()
    await userEvent.click(exportButton)
    expect(result.current.fetchExportData).toBeCalled()
  })
})
