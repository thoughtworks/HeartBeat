import { addNotification, closeNotification } from '@src/context/notification/NotificationSlice';
import { Notification } from '@src/components/Common/NotificationButton';
import { render, screen, waitFor } from '@testing-library/react';
import { setupStore } from '@test/utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { DURATION } from '@src/constants/commons';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import React from 'react';

jest.mock('@src/context/notification/NotificationSlice', () => ({
  ...jest.requireActual('@src/context/notification/NotificationSlice'),
  closeNotification: jest.fn().mockReturnValue({ type: 'CLOSE_NOTIFICATION' }),
}));

describe('Notification', () => {
  const setup = () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <Notification />
      </Provider>,
    );
    return store;
  };

  it('should render all notifications correctly', () => {
    const store = setup();
    act(() => {
      store.dispatch(addNotification({ title: 'Notification', message: 'Notification Message 1' }));
      store.dispatch(addNotification({ title: 'Notification', message: 'Notification Message 2' }));
    });

    expect(screen.queryAllByText('Notification')).toHaveLength(2);
    expect(screen.getByText('Notification Message 1')).toBeInTheDocument();
    expect(screen.getByText('Notification Message 2')).toBeInTheDocument();
  });

  it('should call closeNotification with corresponding id when clicking close button', async () => {
    const store = setup();
    act(() => {
      store.dispatch(addNotification({ id: '1', title: 'Notification', message: 'Notification Message 1' }));
      store.dispatch(addNotification({ id: '2', title: 'Notification', message: 'Notification Message 2' }));
    });

    const closeButton = screen.getAllByRole('button', { name: 'Close' });

    await userEvent.click(closeButton[0]);

    await waitFor(() => {
      expect(closeNotification).toBeCalledWith('1');
    });
  });

  it.each`
    type         | title                        | backgroundColor | icon                 | iconColor    | borderColor
    ${'error'}   | ${'Something went wrong!'}   | ${'#FFE7EA'}    | ${'CancelIcon'}      | ${'#D74257'} | ${'#F3B6BE'}
    ${'success'} | ${'Successfully completed!'} | ${'#EFFFF1'}    | ${'CheckCircleIcon'} | ${'#5E9E66'} | ${'#CFE2D1'}
    ${'warning'} | ${'Please note that'}        | ${'#FFF4E3'}    | ${'InfoIcon'}        | ${'#D78D20'} | ${'#F3D5A9'}
    ${'info'}    | ${'Help Information'}        | ${'#E9ECFF'}    | ${'InfoIcon'}        | ${'#4050B5'} | ${'#939DDA'}
  `(
    `should render title $title background color $backgroundColor, $icon in $iconColor, border color $borderColor given the "type" value is $type`,
    async ({ type, title, backgroundColor, icon, iconColor, borderColor }) => {
      const store = setup();
      act(() => {
        store.dispatch(addNotification({ message: 'Notification Message 1', type }));
      });

      expect(screen.getByText(title)).toBeInTheDocument();
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveStyle({ 'background-color': backgroundColor });
      expect(alertElement).toHaveStyle({ border: `0.0625rem solid ${borderColor}` });

      const iconElement = screen.getByTestId(icon).parentElement;
      expect(iconElement).toBeInTheDocument();
      expect(iconElement).toHaveStyle({ color: iconColor });
      expect(screen.getByTestId(icon)).toBeInTheDocument();
    },
  );

  it('should close notification when time exceeds 10s', async () => {
    jest.useFakeTimers();

    const store = setup();
    act(() => {
      store.dispatch(addNotification({ id: '1', title: 'Notification', message: 'Notification Message 1' }));
      store.dispatch(addNotification({ id: '2', title: 'Notification', message: 'Notification Message 2' }));
    });

    act(() => {
      jest.advanceTimersByTime(DURATION.NOTIFICATION_TIME);
    });

    expect(closeNotification).toBeCalledWith('1');
    expect(closeNotification).toBeCalledWith('2');

    jest.useRealTimers();
  });
});
