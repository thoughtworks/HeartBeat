import { act, render, waitFor } from '@testing-library/react'
import ReportStep from '@src/components/Metrics/ReportStep'
import {
  BACK,
  ERROR_PAGE_ROUTE,
  EXPECTED_REPORT_VALUES,
  EXPORT_BOARD_DATA,
  EXPORT_METRIC_DATA,
  EXPORT_PIPELINE_DATA,
  REQUIRED_DATA_LIST,
} from '../../../fixtures'
import { setupStore } from '../../../utils/setupStoreUtil'
import { Provider } from 'react-redux'
import { updateDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice'
import { updateMetrics, updatePipelineToolVerifyResponse } from '@src/context/config/configSlice'
import userEvent from '@testing-library/user-event'
import { backStep } from '@src/context/stepper/StepperSlice'
import { navigateMock } from '../../../../setupTests'
import mocked = jest.mocked
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'

jest.mock('@src/hooks/useGenerateReportEffect', () => ({
  useGenerateReportEffect: jest.fn().mockReturnValue({
    generateReport: jest.fn(() => Promise.resolve(EXPECTED_REPORT_VALUES)),
    isLoading: false,
    isServerError: false,
  }),
}))
jest.mock('@src/context/stepper/StepperSlice', () => ({
  ...jest.requireActual('@src/context/stepper/StepperSlice'),
  backStep: jest.fn().mockReturnValue({ type: 'BACK_STEP' }),
}))

jest.mock('@src/hooks/useExportCsvEffect', () => ({
  useExportCsvEffect: jest.fn().mockReturnValue({
    fetchExportData: jest.fn(),
    errorMessage: 'failed export csv',
    isServerError: false,
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
  const setup = async (params: [string]) => {
    const openNotificationProps = { open: true, title: 'NotificationPopper' }
    const setNotificationProps = jest.fn()
    store = setupStore()
    await store.dispatch(updateMetrics(params))
    await store.dispatch(
      updateDeploymentFrequencySettings({ updateId: 0, label: 'organization', value: 'mock organization' })
    )
    await store.dispatch(
      updateDeploymentFrequencySettings({ updateId: 0, label: 'pipelineName', value: 'mock pipeline name' })
    )
    await store.dispatch(updateDeploymentFrequencySettings({ updateId: 0, label: 'step', value: 'mock step1' }))
    await store.dispatch(
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
        <ReportStep notificationProps={openNotificationProps} setNotificationProps={setNotificationProps} />
      </Provider>
    )
  }
  afterEach(() => {
    store = null
    jest.clearAllMocks()
  })

  it('should render report page', async () => {
    const { getByText } = await act(() => setup(['']))

    await waitFor(() => {
      expect(getByText(REQUIRED_DATA_LIST[1])).toBeInTheDocument()
      expect(getByText(REQUIRED_DATA_LIST[2])).toBeInTheDocument()
    })
  })

  it('should renders the velocity component with correct props', async () => {
    const { getByText } = await act(() => setup(['']))

    await waitFor(() => {
      expect(getByText(20)).toBeInTheDocument()
      expect(getByText(14)).toBeInTheDocument()
    })
  })

  it('should renders the CycleTime component with correct props', async () => {
    const { getByText } = await act(() => setup(['']))

    await waitFor(() => {
      expect(getByText('30.26(days/card)')).toBeInTheDocument()
      expect(getByText('21.18(days/SP)')).toBeInTheDocument()
      expect(getByText('57.25%')).toBeInTheDocument()
      expect(getByText('12.13(days/SP)')).toBeInTheDocument()
    })
  })

  it('should call handleBack method when click back button given back button enabled', async () => {
    const { getByText } = await act(() => setup(['']))

    await userEvent.click(getByText(BACK))

    expect(backStep).toHaveBeenCalledTimes(1)
  })

  it('should not show export pipeline button when not select deployment frequency', async () => {
    const { queryByText } = await act(() => setup([REQUIRED_DATA_LIST[1]]))

    const exportPipelineButton = queryByText(EXPORT_PIPELINE_DATA)

    expect(exportPipelineButton).not.toBeInTheDocument()
  })

  it.each([[REQUIRED_DATA_LIST[4]], [REQUIRED_DATA_LIST[5]], [REQUIRED_DATA_LIST[6]], [REQUIRED_DATA_LIST[7]]])(
    'should show export pipeline button when select %s',
    async (requiredData) => {
      const { getByText } = await act(() => setup([requiredData]))
      const exportPipelineButton = getByText(EXPORT_PIPELINE_DATA)

      expect(exportPipelineButton).toBeInTheDocument()
    }
  )

  it('should show errorMessage when generateReport has error message', async () => {
    mocked(useGenerateReportEffect).mockReturnValue({
      generateReport: jest.fn(),
      isLoading: false,
      errorMessage: 'error message',
      isServerError: false,
    })

    const { getByText } = await act(() => setup(['']))

    expect(getByText('error message')).toBeInTheDocument()
  })

  it('should show errorMessage when click export pipeline button given csv not exist', async () => {
    const { getByText } = await act(() => setup([REQUIRED_DATA_LIST[4]]))

    await userEvent.click(getByText(EXPORT_PIPELINE_DATA))

    expect(getByText('failed export csv')).toBeInTheDocument()
  })

  it('should not show export board button when not select board metrics', async () => {
    const { queryByText } = await act(() => setup([REQUIRED_DATA_LIST[4]]))

    const exportPipelineButton = queryByText(EXPORT_BOARD_DATA)

    expect(exportPipelineButton).not.toBeInTheDocument()
  })

  it.each([[REQUIRED_DATA_LIST[1]], [REQUIRED_DATA_LIST[2]], [REQUIRED_DATA_LIST[3]]])(
    'should show export board button when select %s',
    async (requiredData) => {
      const { getByText } = await act(() => setup([requiredData]))
      const exportPipelineButton = getByText(EXPORT_BOARD_DATA)

      expect(exportPipelineButton).toBeInTheDocument()
    }
  )

  it('should show errorMessage when click export board button given csv not exist', async () => {
    const { getByText } = await act(() => setup([REQUIRED_DATA_LIST[1]]))
    await userEvent.click(getByText(EXPORT_BOARD_DATA))

    expect(getByText('failed export csv')).toBeInTheDocument()
  })

  it('should show errorMessage when click export metric button given csv not exist', async () => {
    const { getByText } = await act(() => setup(['']))

    await userEvent.click(getByText(EXPORT_METRIC_DATA))

    expect(getByText('Export metric data')).toBeInTheDocument()
  })

  it('should show export metric button when visiting this page', async () => {
    const { getByText } = await act(() => setup(['']))

    const exportMetricButton = getByText(EXPORT_METRIC_DATA)
    expect(exportMetricButton).toBeInTheDocument()
  })

  it('should check error page show when isReportError is true', async () => {
    mocked(useGenerateReportEffect).mockReturnValue({
      generateReport: jest.fn(),
      isLoading: false,
      errorMessage: 'error message',
      isServerError: true,
    })

    await setup([REQUIRED_DATA_LIST[1]])

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(ERROR_PAGE_ROUTE)
    })
  })

  it('should render loading page when isLoading is true', async () => {
    mocked(useGenerateReportEffect).mockReturnValue({
      generateReport: jest.fn(),
      isLoading: true,
      errorMessage: '',
      isServerError: false,
    })

    const { getByTestId } = await act(() => setup(['']))

    await waitFor(() => {
      expect(getByTestId('loading-page')).toBeInTheDocument()
    })
  })
})
