import metaReducer, {
  deleteMetricsPipelineFormMeta,
  initMetricsPipelineFormMeta,
  MetaState,
  resetFormMeta,
  saveVersion,
  updateFormMeta,
  updateMetricsPipelineBranchFormMeta,
  clearMetricsPipelineFormMeta,
  getErrorDetail,
} from '@src/context/meta/metaSlice';
import { VERSION_RESPONSE } from '../fixtures';
import { RootState } from '@src/store';

const MOCK_EMPTY_STATE: MetaState = {
  version: '',
  form: {
    metrics: { pipelines: {} },
  },
};

const MOCK_STATE: MetaState = {
  version: '1',
  form: {
    metrics: {
      pipelines: {
        1: {
          branches: [
            {
              value: 'value',
            },
          ],
        },
        2: {
          branches: [],
        },
      },
    },
  },
};

describe('meta reducer', () => {
  it('should get empty when handle initial state', () => {
    const meta = metaReducer(undefined, { type: 'unknown' });

    expect(meta.version).toEqual('');
  });

  it('should set 1.11 when handle saveVersion', () => {
    const meta = metaReducer(undefined, saveVersion(VERSION_RESPONSE.version));

    expect(meta.version).toEqual(VERSION_RESPONSE.version);
  });

  it('should return initial form meta when resetFormMeta', () => {
    const meta = metaReducer(MOCK_STATE, resetFormMeta());

    expect(meta.form).toMatchObject({
      metrics: {
        pipelines: {},
      },
    });
  });

  it('should return updated form meta info when updateFormMeta', () => {
    const meta = metaReducer(
      MOCK_STATE,
      updateFormMeta({
        path: 'metrics',
        data: { pipelines: {} },
      }),
    );

    expect(meta.form).toMatchObject({
      metrics: {
        pipelines: {},
      },
    });
  });

  it('should clear pipelines when call clearMetricsPipelineFormMeta', () => {
    const meta = metaReducer(MOCK_STATE, clearMetricsPipelineFormMeta());

    expect(meta.form).toMatchObject({
      metrics: {
        pipelines: {},
      },
    });
  });

  it('should return remaining pipeline when delete one', () => {
    const meta = metaReducer(MOCK_STATE, deleteMetricsPipelineFormMeta(1));

    expect(meta.form.metrics.pipelines).toMatchObject({
      2: {
        branches: [],
      },
    });
  });

  it('should return initialized pipeline when initMetricsPipelineFormMeta', () => {
    const meta = metaReducer(MOCK_EMPTY_STATE, initMetricsPipelineFormMeta(1));

    expect(meta.form.metrics.pipelines).toMatchObject({
      1: {
        branches: [],
      },
    });
  });

  it('should update a branch when updateMetricsPipelineBranchFormMeta', () => {
    const meta = metaReducer(
      MOCK_STATE,
      updateMetricsPipelineBranchFormMeta({ id: 1, data: { value: 'value', error: true } }),
    );

    expect(meta.form.metrics.pipelines).toMatchObject({
      1: {
        branches: [{ value: 'value', error: true }],
      },
      2: {
        branches: [],
      },
    });
  });

  it('should add a branch when are not editing old data', () => {
    const meta = metaReducer(
      MOCK_STATE,
      updateMetricsPipelineBranchFormMeta({ id: 1, data: { value: 'new value', error: true } }),
    );

    expect(meta.form.metrics.pipelines).toMatchObject({
      1: {
        branches: [{ value: 'value' }, { value: 'new value', error: true }],
      },
      2: {
        branches: [],
      },
    });
  });

  it('should return undefined If no errorDetail in any branch', () => {
    expect(
      getErrorDetail({
        meta: {
          ...MOCK_STATE,
          form: {
            metrics: {
              pipelines: {
                1: {
                  branches: [{ value: 'branch1', error: false }],
                },
                2: {
                  branches: [{ value: 'branch2', error: false }],
                },
              },
            },
          },
        },
      } as unknown as RootState),
    ).toBeUndefined();
  });

  it('should return errorDetail If there is an error in a pipeline branch', () => {
    expect(
      getErrorDetail({
        meta: {
          ...MOCK_STATE,
          form: {
            metrics: {
              pipelines: {
                1: {
                  branches: [{ value: 'val', error: true, errorDetail: 404 }],
                },
                2: {
                  branches: [],
                },
              },
            },
          },
        },
      } as unknown as RootState),
    ).toEqual(404);
  });
});
