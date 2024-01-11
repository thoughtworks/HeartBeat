import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@src/store';

export interface headerState {
  version: string;
}

const initialState: headerState = {
  version: '',
};

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    saveVersion: (state, action) => {
      state.version = action.payload;
    },
  },
});

export const { saveVersion } = headerSlice.actions;

export const getVersion = (state: RootState) => state.header.version;

export default headerSlice.reducer;
