import { HomeGuide } from '@src/components/HomeGuide'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { setupStore } from '../../utils/setupStoreUtil'
import { Provider } from 'react-redux'
import {
  CONFIG_PAGE_VERIFY_IMPORT_ERROR_MESSAGE,
  CREATE_NEW_PROJECT,
  IMPORTED_CONFIG_FIXTURE,
  IMPORT_PROJECT_FROM_FILE,
} from '../../fixtures'
import userEvent from '@testing-library/user-event'
import { navigateMock } from '../../../setupTests'

const mockedUseAppDispatch = jest.fn()

jest.mock('@src/hooks/useAppDispatch', () => ({
  ...jest.requireActual('react-router-dom'),
  useAppDispatch: () => mockedUseAppDispatch,
}))

let store = setupStore()

const setup = () => {
  store = setupStore()
  return render(
    <Provider store={store}>
      <HomeGuide />
    </Provider>
  )
}

const copied = () => JSON.parse(JSON.stringify(IMPORTED_CONFIG_FIXTURE))

describe('HomeGuide', () => {
  beforeEach(() => {
    store = setupStore()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show 2 buttons', () => {
    const { getByText } = setup()

    expect(getByText(IMPORT_PROJECT_FROM_FILE)).toBeInTheDocument()
    expect(getByText(CREATE_NEW_PROJECT)).toBeInTheDocument()
  })

  it('should render input when click guide button', async () => {
    const { getByText, getByTestId } = setup()
    const fileInput = getByTestId('testInput')

    const clickSpy = jest.spyOn(fileInput, 'click')
    await userEvent.click(getByText(IMPORT_PROJECT_FROM_FILE))

    expect(clickSpy).toHaveBeenCalled()
  })

  it('should go to Metrics page and read file when click import file button', async () => {
    const file = new File([`${JSON.stringify(IMPORTED_CONFIG_FIXTURE)}`], 'test.json', {
      type: 'file',
    })

    const { getByTestId } = setup()
    const input = getByTestId('testInput')

    Object.defineProperty(input, 'files', {
      value: [file],
    })

    fireEvent.change(input)

    await waitFor(() => {
      expect(mockedUseAppDispatch).toHaveBeenCalledTimes(3)
      expect(navigateMock).toHaveBeenCalledWith('/metrics')
    })
  })

  it('should go to Metrics page when click create a new project button', async () => {
    const { getByText } = setup()

    await userEvent.click(getByText(CREATE_NEW_PROJECT))

    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('/metrics')
  })

  describe('Test invalid config', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { projectName, ...noProjectNameConfig } = IMPORTED_CONFIG_FIXTURE

    const noStartDateConfig = copied()
    noStartDateConfig.dateRange.startDate = ''

    const noEndDateConfig = copied()
    noEndDateConfig.dateRange.endDate = ''

    const noMetricsConfig = copied()
    noMetricsConfig.metrics = []

    it.each([
      ['noProjectNameConfig', noProjectNameConfig],
      ['noStartDateConfig', noStartDateConfig],
      ['noEndDateConfig', noEndDateConfig],
      ['noMetricsConfig', noMetricsConfig],
    ])(
      'should show error message when import project from file given file does not contain %s field',
      async (_, config) => {
        const { getByTestId, queryByText } = setup()

        const file = new File([`${JSON.stringify(config)}`], 'test.json', {
          type: 'file',
        })
        const input = getByTestId('testInput')

        Object.defineProperty(input, 'files', {
          value: [file],
        })

        fireEvent.change(input)

        await waitFor(() => {
          expect(mockedUseAppDispatch).toHaveBeenCalledTimes(0)
          expect(queryByText(CONFIG_PAGE_VERIFY_IMPORT_ERROR_MESSAGE)).toBeInTheDocument()
        })
      }
    )
  })
})
