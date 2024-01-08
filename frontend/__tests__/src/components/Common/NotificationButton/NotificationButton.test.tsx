import { render, renderHook, waitFor, screen } from '@testing-library/react';
import { Notification } from '@src/components/Common/NotificationButton';
import React from 'react';
import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

const notificationIcon = 'NotificationIcon';
describe('NotificationButton', () => {
  const closeNotificationProps = {
    open: false,
    title: 'NotificationPopper',
    message: 'Notification Message',
    closeAutomatically: false,
  };
  const openNotificationProps = {
    open: true,
    title: 'NotificationPopper',
    message: 'Notification Message',
    closeAutomatically: false,
  };
  const { result } = renderHook(() => useNotificationLayoutEffect());

  it('should show NotificationIcon when render NotificationButton component', () => {
    const { getByTestId } = render(<Notification {...result.current} />);

    expect(getByTestId(notificationIcon)).toBeInTheDocument();
  });

  it('should show NotificationPopper when clicking the component given the "open" value is true', async () => {
    act(() => {
      result.current.notificationProps = openNotificationProps;
    });
    const { getByText } = render(<Notification {...result.current} />);
    await userEvent.click(screen.getByTestId(notificationIcon));
    expect(getByText('NotificationPopper')).toBeInTheDocument();
  });

  it('should hide NotificationPopper when clicking the component  given the "open" value is false', async () => {
    act(() => {
      result.current.notificationProps = closeNotificationProps;
    });
    const { getByTestId, queryByText } = render(<Notification {...result.current} />);
    await userEvent.click(getByTestId(notificationIcon));

    expect(queryByText('NotificationPopper')).not.toBeInTheDocument();
  });

  it('should  call updateProps when clicking outside the component given the "open" value.', async () => {
    let checkProps = openNotificationProps;
    act(() => {
      result.current.notificationProps = openNotificationProps;
      result.current.updateProps = jest.fn().mockImplementation(() => (checkProps = closeNotificationProps));
    });

    const { getByRole, getByText } = render(
      <div>
        <title> OutSideSection </title>
        <Notification {...result.current} />
      </div>
    );

    expect(getByRole('tooltip')).toBeInTheDocument();

    const content = await waitFor(() => getByText('OutSideSection'));
    await userEvent.click(content);

    expect(result.current.updateProps).toBeCalledTimes(1);
    expect(checkProps).toEqual(closeNotificationProps);
  });
});
