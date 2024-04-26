import {
  ALL,
  DEV_CHANGE_FAILURE_RATE,
  CLASSIFICATION,
  CYCLE_TIME,
  DEPLOYMENT_FREQUENCY,
  LEAD_TIME_FOR_CHANGES,
  DEV_MEAN_TIME_TO_RECOVERY,
  REQUIRED_DATA,
  REQUIRED_DATA_LIST,
  REWORK_TIMES,
  VELOCITY,
} from '../../fixtures';
import { basicInfoDefaultValues } from '@src/containers/ConfigStep/Form/useDefaultValues';
import { basicInfoSchema } from '@src/containers/ConfigStep/Form/schema';
import { render, waitFor, within, screen } from '@testing-library/react';
import { SELECTED_VALUE_SEPARATOR } from '@src/constants/commons';
import BasicInfo from '@src/containers/ConfigStep/BasicInfo';
import { setupStore } from '../../utils/setupStoreUtil';
import { FormProvider } from '@test/utils/FormProvider';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

let store = null;

describe('MetricsTypeCheckbox', () => {
  const setup = () => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <FormProvider schema={basicInfoSchema} defaultValues={basicInfoDefaultValues}>
          <BasicInfo />
        </FormProvider>
      </Provider>,
    );
  };
  afterEach(() => {
    store = null;
  });
  it('should show require data and do not display specific options when init', () => {
    const { getByText, queryByText } = setup();
    const require = getByText(REQUIRED_DATA);

    expect(require).toBeInTheDocument();

    const option = queryByText(VELOCITY);
    expect(option).not.toBeInTheDocument();
  });

  it('should show detail options when click require data button', async () => {
    const { getByRole } = setup();
    await userEvent.click(screen.getByRole('combobox', { name: REQUIRED_DATA }));
    const listBox = within(getByRole('listbox'));
    const options = listBox.getAllByRole('option');
    const optionValue = options.map((li) => li.getAttribute('data-value'));

    expect(optionValue).toEqual(REQUIRED_DATA_LIST);
  });

  it('should show multiple selections when multiple options are selected', async () => {
    const { getByRole, getByText } = setup();
    await userEvent.click(screen.getByRole('combobox', { name: REQUIRED_DATA }));
    const listBox = within(getByRole('listbox'));
    await userEvent.click(listBox.getByRole('option', { name: VELOCITY }));
    await userEvent.click(listBox.getByRole('option', { name: CYCLE_TIME }));

    expect(getByText([VELOCITY, CYCLE_TIME].join(SELECTED_VALUE_SEPARATOR))).toBeInTheDocument();
  });

  it('should show all selections when all option are select', async () => {
    const { getByRole, getByText } = setup();
    const displayedDataList = REQUIRED_DATA_LIST.slice(1);
    await userEvent.click(getByRole('combobox', { name: REQUIRED_DATA }));
    const listBox = within(getByRole('listbox'));
    await userEvent.click(listBox.getByRole('option', { name: ALL }));

    expect(within(listBox.getByRole('option', { name: ALL })).getByTestId('CheckBoxIcon')).toBeTruthy();
    expect(getByText(displayedDataList.join(SELECTED_VALUE_SEPARATOR))).toBeInTheDocument();
  });

  it('should show all selections when click velocity selection and then click all selection', async () => {
    const { getByRole, getByText } = setup();
    const displayedDataList = REQUIRED_DATA_LIST.slice(1);

    await userEvent.click(getByRole('combobox', { name: REQUIRED_DATA }));
    const listBox = within(getByRole('listbox'));
    await userEvent.click(listBox.getByRole('option', { name: VELOCITY }));
    await userEvent.click(listBox.getByRole('option', { name: ALL }));

    expect(within(listBox.getByRole('option', { name: ALL })).getByTestId('CheckBoxIcon')).toBeTruthy();
    expect(getByText(displayedDataList.join(SELECTED_VALUE_SEPARATOR))).toBeInTheDocument();
  });

  it('should be checked of All selected option when click any other options', async () => {
    const { getByRole } = setup();
    await userEvent.click(getByRole('combobox', { name: REQUIRED_DATA }));

    const listBox = within(getByRole('listbox'));
    const optionsToClick = [
      listBox.getByRole('option', { name: VELOCITY }),
      listBox.getByRole('option', { name: CYCLE_TIME }),
      listBox.getByRole('option', { name: CLASSIFICATION }),
      listBox.getByRole('option', { name: REWORK_TIMES }),
      listBox.getByRole('option', { name: LEAD_TIME_FOR_CHANGES }),
      listBox.getByRole('option', { name: DEPLOYMENT_FREQUENCY }),
      listBox.getByRole('option', { name: DEV_CHANGE_FAILURE_RATE }),
      listBox.getByRole('option', { name: DEV_MEAN_TIME_TO_RECOVERY }),
    ];
    await Promise.all(optionsToClick.map((opt) => userEvent.click(opt)));

    expect(within(listBox.getByRole('option', { name: ALL })).getByTestId('CheckBoxIcon')).toBeTruthy();
  });

  it('should show some selections when click all option and then click velocity selection', async () => {
    const { getByRole, getByText } = setup();
    const displayedDataList = REQUIRED_DATA_LIST.slice(1, REQUIRED_DATA_LIST.length - 1);

    await userEvent.click(getByRole('combobox', { name: REQUIRED_DATA }));

    const listBox = within(getByRole('listbox'));
    await userEvent.click(listBox.getByRole('option', { name: ALL }));
    await userEvent.click(listBox.getByRole('option', { name: DEV_MEAN_TIME_TO_RECOVERY }));

    expect(listBox.getByRole('option', { name: DEV_MEAN_TIME_TO_RECOVERY })).toHaveAttribute('aria-selected', 'false');
    expect(within(listBox.getByRole('option', { name: ALL })).getByTestId('CheckBoxOutlineBlankIcon')).toBeTruthy();
    expect(getByText(displayedDataList.join(SELECTED_VALUE_SEPARATOR))).toBeInTheDocument();
  });

  it('should show none selection when double click all option', async () => {
    const { getByRole, getByText } = setup();
    await userEvent.click(getByRole('combobox', { name: REQUIRED_DATA }));
    const listBox = within(getByRole('listbox'));
    await userEvent.dblClick(listBox.getByRole('option', { name: ALL }));
    await userEvent.click(getByRole('listbox', { name: REQUIRED_DATA }));

    const errorMessage = getByText('Metrics is required');
    await waitFor(() => expect(errorMessage).toBeInTheDocument());
  });

  it('should show error message when require data is null', async () => {
    const { getByRole, getByText } = setup();

    await userEvent.click(getByRole('combobox', { name: REQUIRED_DATA }));
    const listBox = within(getByRole('listbox'));
    await userEvent.click(listBox.getByRole('option', { name: VELOCITY }));
    await userEvent.click(listBox.getByRole('option', { name: VELOCITY }));
    await userEvent.click(getByRole('listbox', { name: REQUIRED_DATA }));

    expect(getByText(/Metrics is required/i)).toBeInTheDocument();
  });
});
