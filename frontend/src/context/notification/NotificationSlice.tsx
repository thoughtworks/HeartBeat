import { createSlice } from '@reduxjs/toolkit';
import { AlertColor } from '@mui/material';
import { RootState } from '@src/store';
import { uniqueId } from 'lodash';

export interface Notification {
  id: string;
  title?: string;
  message: string;
  type?: AlertColor;
}

export interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    closeAllNotifications: (state) => {
      state.notifications = initialState.notifications;
    },
    addNotification: (state, action) => {
      const newNotification = { id: uniqueId(), ...action.payload };
      state.notifications = [...state.notifications, newNotification];
    },
    closeNotification: (state, action) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
  },
});

export const { addNotification, closeNotification, closeAllNotifications } = notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notification.notifications;

export default notificationSlice.reducer;
