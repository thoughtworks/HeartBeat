import {
  CREATE_NEW_PROJECT,
  HOME_VERIFY_IMPORT_WARNING_MESSAGE,
  IMPORT_PROJECT_FROM_FILE,
  METRICS_PAGE_ROUTE,
  IMPORTED_NEW_CONFIG_FIXTURE,
} from '../../fixtures';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { setupStore } from '../../utils/setupStoreUtil';
import { HomeGuide } from '@src/components/HomeGuide';
import userEvent from '@testing-library/user-event';
import { navigateMock } from '../../setupTests';
import { Provider } from 'react-redux';

const mockedUseAppDispatch = jest.fn();

jest.mock('@src/hooks/useAppDispatch', () => ({
  ...jest.requireActual('react-router-dom'),
  useAppDispatch: () => mockedUseAppDispatch,
}));

let store = setupStore();

const setup = () => {
  store = setupStore();
  return render(
    <Provider store={store}>
      <HomeGuide />
    </Provider>,
  );
};

const setupInputFile = async (configJson: object) => {
  const { queryByText, getByTestId } = setup();
  const file = new File([`${JSON.stringify(configJson)}`], 'test.json', {
    type: 'file',
  });

  const input = getByTestId('testInput');

  Object.defineProperty(input, 'files', {
    value: [file],
  });

  await fireEvent.change(input);
  return queryByText;
};

describe('HomeGuide', () => {
  beforeEach(() => {
    store = setupStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show 2 buttons', () => {
    const { getByText } = setup();

    expect(getByText(IMPORT_PROJECT_FROM_FILE)).toBeInTheDocument();
    expect(getByText(CREATE_NEW_PROJECT)).toBeInTheDocument();
  });

  it('should render input when click guide button', async () => {
    const { getByTestId } = setup();
    const fileInput = getByTestId('testInput');

    const clickSpy = jest.spyOn(fileInput, 'click');
    await userEvent.click(screen.getByText(IMPORT_PROJECT_FROM_FILE));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should go to Metrics page and read file when click import file button', async () => {
    const { getByTestId } = setup();

    const file = new File([`${JSON.stringify(IMPORTED_NEW_CONFIG_FIXTURE)}`], 'test.json', {
      type: 'file',
    });

    const input = getByTestId('testInput');

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(mockedUseAppDispatch).toHaveBeenCalledTimes(5);
      expect(navigateMock).toHaveBeenCalledWith(METRICS_PAGE_ROUTE);
    });
  });

  it('should go to Metrics page when click create a new project button', async () => {
    setup();
    await userEvent.click(screen.getByText(CREATE_NEW_PROJECT));
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(METRICS_PAGE_ROUTE);
  });

  describe('isValidImportedConfig', () => {
    it('should show warning message when no projectName dateRange metrics all exist', async () => {
      const emptyConfig = {};
      const queryByText = await setupInputFile(emptyConfig);

      await waitFor(() => {
        expect(mockedUseAppDispatch).toHaveBeenCalledTimes(0);
        expect(queryByText(HOME_VERIFY_IMPORT_WARNING_MESSAGE)).toBeInTheDocument();
      });
    });

    it('should no display warning message when  projectName dateRange metrics all exist', async () => {
      const queryByText = await setupInputFile(IMPORTED_NEW_CONFIG_FIXTURE);

      await waitFor(() => {
        expect(mockedUseAppDispatch).toHaveBeenCalledTimes(0);
        expect(queryByText(HOME_VERIFY_IMPORT_WARNING_MESSAGE)).not.toBeInTheDocument();
      });
    });

    it.each([
      ['projectName', { projectName: '', metrics: [], dateRange: {} }],
      ['startDate', { projectName: 'Test Project', metrics: [], dateRange: { startDate: '2023-01-01', endDate: '' } }],
      ['endDate', { projectName: '', metrics: [], dateRange: { startDate: '', endDate: '2023-02-01' } }],
      ['metrics', { projectName: '', metrics: ['Metric 1', 'Metric 2'], dateRange: {} }],
    ])('should not display warning message when only %s exists', async (_, validConfig) => {
      const queryByText = await setupInputFile(validConfig);

      await waitFor(() => {
        expect(mockedUseAppDispatch).toHaveBeenCalledTimes(0);
        expect(queryByText(HOME_VERIFY_IMPORT_WARNING_MESSAGE)).not.toBeInTheDocument();
      });
    });
  });
});
