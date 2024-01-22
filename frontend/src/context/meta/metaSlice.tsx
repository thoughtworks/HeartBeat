import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@src/store';

import { omit, set } from 'lodash';

export interface FormFieldWithMeta {
  value: string;
  error?: boolean;
  needVerify?: boolean;
  errorDetail?: number | string;
}

interface FormMetaMetricsPipeline {
  branches: Record<string, FormFieldWithMeta>;
}

export interface MetaState {
  version: string;
  form: {
    metrics: {
      pipelines: Record<string, FormMetaMetricsPipeline>;
    };
  };
}

const initialFormMetaState = {
  metrics: {
    pipelines: {},
  },
};

const initialState: MetaState = {
  version: '',
  form: initialFormMetaState,
};

export const metaSlice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    saveVersion: (state, action) => {
      state.version = action.payload;
    },
    resetFormMeta: (state) => {
      state.form = initialFormMetaState;
    },
    updateFormMeta: (state, action) => {
      const { path, data } = action.payload;

      set(state, `form.${path}`, data);
    },
    deleteMetricsPipelineFormMeta: (state, action) => {
      const deleteId = action.payload;
      const formData = state.form.metrics.pipelines;
      state.form.metrics.pipelines = omit(formData, deleteId);
    },
  },
});

export const { saveVersion, resetFormMeta, updateFormMeta, deleteMetricsPipelineFormMeta } = metaSlice.actions;

export const getVersion = (state: RootState) => state.meta.version;

export const getFormMeta = (state: RootState) => state.meta.form;

export default metaSlice.reducer;
