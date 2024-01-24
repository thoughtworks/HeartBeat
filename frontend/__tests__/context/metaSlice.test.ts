import metaReducer, {
  deleteMetricsPipelineFormMeta,
  initMetricsPipelineFormMeta,
  MetaState,
  resetFormMeta,
  saveVersion,
  updateFormMeta,
  updateMetricsPipelineBranchFormMeta,
} from '@src/context/meta/metaSlice';
import { VERSION_RESPONSE } from '../fixtures';

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
          branches: [],
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
    const meta = metaReducer(MOCK_STATE, updateMetricsPipelineBranchFormMeta({ id: 1, data: { value: 'val' } }));

    expect(meta.form.metrics.pipelines).toMatchObject({
      1: {
        branches: [{ value: 'val' }],
      },
      2: {
        branches: [],
      },
    });
  });
});
