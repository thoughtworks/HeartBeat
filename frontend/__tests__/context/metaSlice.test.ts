import metaReducer, {
  deleteMetricsPipelineFormMeta,
  MetaState,
  resetFormMeta,
  saveVersion,
  updateFormMeta,
} from '@src/context/meta/metaSlice';
import { VERSION_RESPONSE } from '../fixtures';

const MOCK_STATE: MetaState = {
  version: '1',
  form: {
    metrics: {
      pipelines: {
        p1: {
          branches: {},
        },
        p2: {
          branches: {},
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
    const meta = metaReducer(MOCK_STATE, deleteMetricsPipelineFormMeta('p1'));

    expect(meta.form.metrics.pipelines).toMatchObject({
      p2: {
        branches: {},
      },
    });
  });
});
