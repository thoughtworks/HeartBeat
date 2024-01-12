import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@src/store';
import PresentationForErrorCases, {
  IPresentationForErrorCasesProps,
} from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PresentationForErrorCases';
import userEvent from '@testing-library/user-event';

const setup = (props: IPresentationForErrorCasesProps) =>
  render(
    <Provider store={store}>
      <PresentationForErrorCases {...props} />
    </Provider>
  );

describe('<PresentationForErrorCases />', () => {
  const errors = [
    { code: 204, title: 'No pipeline!' },
    { code: 400, title: 'Invalid input!' },
    { code: 401, title: 'Unauthorized request!' },
    { code: 403, title: 'Forbidden request!' },
    { code: 404, title: 'Not found!' },
    { code: undefined, title: 'Unknown error' },
  ];
  const errorMessage =
    'Please go back to the previous page and change your pipeline token with correct access permission.';
  it.each(errors)(
    'should properly render error UI with title:$title and corresponding message',
    ({ code, title: errorTitle }) => {
      const props = { code, errorTitle, errorMessage, isLoading: false, retry: () => '' };
      setup(props);

      const titleNode = screen.getByText(errorTitle);
      const messageNode = screen.getByText(errorMessage);

      expect(titleNode).toBeVisible();
      expect(messageNode).toBeVisible();
    }
  );

  it('should display "try again" when error code is 503', async () => {
    const retrySpy = jest.fn();
    const mockTimeoutError = {
      code: 503,
      errorTitle: 'Service Unavailable!',
      errorMessage: 'Data loading failed, please try again',
      isLoading: false,
      retry: retrySpy,
    };
    setup(mockTimeoutError);

    const titleNode = screen.queryByText(mockTimeoutError.errorTitle);
    const tryAgainNode = screen.getByText('try again');

    expect(titleNode).not.toBeInTheDocument();
    expect(tryAgainNode).toBeInTheDocument();

    await userEvent.click(tryAgainNode);

    expect(retrySpy).toHaveBeenCalled();
  });

  it('should not fire duplicated retry behavior when retry func is loading', async () => {
    const retrySpy = jest.fn();
    const mockTimeoutErrorProps = {
      code: 503,
      errorTitle: 'Service Unavailable!',
      errorMessage: 'Data loading failed, please try again',
      isLoading: true,
      retry: retrySpy,
    };
    setup(mockTimeoutErrorProps);
    const tryAgainNode = screen.getByText('try again');

    await userEvent.click(tryAgainNode);
    await userEvent.click(tryAgainNode);
    await userEvent.click(tryAgainNode);

    expect(retrySpy).not.toHaveBeenCalled();
  });
});
