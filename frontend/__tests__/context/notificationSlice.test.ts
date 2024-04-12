import notificationReducer, {
  addNotification,
  closeAllNotifications,
  closeNotification,
} from '@src/context/notification/NotificationSlice';

describe('notification reducer', () => {
  it('should get [] when handle initial state', () => {
    const stepper = notificationReducer(undefined, { type: 'unknown' });

    expect(stepper.notifications).toEqual([]);
  });

  it('should get 1 notification when handle addNotification', () => {
    const stepper = notificationReducer(
      {
        notifications: [],
      },
      addNotification({ title: 'Notification', message: 'Notification Message 1' }),
    );

    expect(stepper.notifications).toEqual([
      {
        id: expect.anything(),
        title: 'Notification',
        message: 'Notification Message 1',
      },
    ]);
  });

  it('should remove corresponding notification when handle closeNotification', () => {
    const stepper = notificationReducer(
      {
        notifications: [
          { id: '1', title: 'Notification', message: 'Notification Message 1' },
          { id: '2', title: 'Notification', message: 'Notification Message 2' },
        ],
      },
      closeNotification('1'),
    );

    expect(stepper.notifications).toEqual([{ id: '2', title: 'Notification', message: 'Notification Message 2' }]);
  });

  it('should reset to [] when handle closeAllNotifications', () => {
    const stepper = notificationReducer(
      {
        notifications: [
          { id: '1', title: 'Notification', message: 'Notification Message 1' },
          { id: '2', title: 'Notification', message: 'Notification Message 2' },
        ],
      },
      closeAllNotifications(),
    );

    expect(stepper.notifications).toEqual([]);
  });
});
