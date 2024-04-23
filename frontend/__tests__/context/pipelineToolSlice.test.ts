import {
  selectPipelineNames,
  selectPipelineOrganizations,
  selectSteps,
  selectStepsParams,
  updateDateRange,
  updatePipelineTool,
  updatePipelineToolVerifyResponse,
  updatePipelineToolVerifyResponseSteps,
  updatePipelineToolVerifyState,
} from '@src/context/config/configSlice';
import { MOCK_BUILD_KITE_VERIFY_RESPONSE, PIPELINE_TOOL_TYPES } from '../fixtures';
import configReducer from '@src/context/config/configSlice';
import initialConfigState from '../initialConfigState';
import { setupStore } from '../utils/setupStoreUtil';
import dayjs from 'dayjs';

describe('pipelineTool reducer', () => {
  const MOCK_PIPElINE_TOOL_VERIFY_RESPONSE = {
    pipelineList: [
      {
        id: 'mockId',
        name: 'mockName',
        orgId: 'mockOrgId',
        orgName: 'mockOrgName',
        repository: 'mockRepository',
        steps: ['step1', 'step2'],
        crews: [],
      },
    ],
  };

  const MOCK_PIPElINE_TOOL_VERIFY_RESPONSE_SORT = {
    pipelineList: [
      {
        id: 'mockId',
        name: 'mockName',
        orgId: 'mockOrgId',
        orgName: 'mockOrgName',
        repository: 'mockRepository',
        steps: ['step1', 'step2'],
        crews: [],
      },
      {
        id: 'mockId2',
        name: 'MockName',
        orgId: 'mockOrgId',
        orgName: 'mockOrgName',
        repository: 'mockRepository',
        steps: ['step3', 'step4'],
        crews: [],
      },
    ],
  };

  const MOCK_DATE_RANGE = [
    {
      startDate: '2023-03-04T00:00:00+08:00',
      endDate: '2023-03-18T00:00:00+08:00',
    },
  ];

  it('should set isPipelineToolVerified false when handle initial state', () => {
    const result = configReducer(undefined, { type: 'unknown' });

    expect(result.pipelineTool.isVerified).toEqual(false);
  });

  it('should set isPipelineToolVerified true when handle updatePipelineToolVerifyState given isPipelineToolVerified is true', () => {
    const result = configReducer(initialConfigState, updatePipelineToolVerifyState(true));

    expect(result.pipelineTool.isVerified).toEqual(true);
  });

  it('should update pipelineTool fields when change pipelineTool fields input', () => {
    const config = configReducer(initialConfigState, updatePipelineTool({ token: 'abcd' }));

    expect(config.pipelineTool.config.token).toEqual('abcd');
  });

  it('should update pipelineList when get pipelineTool steps given pipelineList and right params', () => {
    const mockConfigStateHasPipelineList = {
      ...initialConfigState,
      pipelineTool: {
        config: {
          type: PIPELINE_TOOL_TYPES.BUILD_KITE,
          token: '',
        },
        isVerified: false,
        isShow: false,
        verifiedResponse: {
          pipelineList: [
            {
              id: 'mock id',
              name: 'mock name',
              orgId: 'mock id',
              orgName: 'mock orgName',
              repository: 'mock repository url',
              steps: [],
              branches: [],
              crews: [],
            },
          ],
        },
      },
    };
    const mockParams = {
      organization: MOCK_BUILD_KITE_VERIFY_RESPONSE.pipelineList[0].orgName,
      pipelineName: MOCK_BUILD_KITE_VERIFY_RESPONSE.pipelineList[0].name,
      steps: ['mock steps'],
    };
    const pipelineVerifiedResponse = configReducer(
      mockConfigStateHasPipelineList,
      updatePipelineToolVerifyResponseSteps(mockParams),
    );

    expect(pipelineVerifiedResponse.pipelineTool.verifiedResponse.pipelineList).toEqual([
      {
        id: 'mock id',
        name: 'mock name',
        orgId: 'mock id',
        orgName: 'mock orgName',
        repository: 'mock repository url',
        steps: ['mock steps'],
      },
    ]);
  });

  it('should not update pipelineList when get pipelineTool steps given pipelineList and wrong params', () => {
    const mockConfigStateHasPipelineList = {
      ...initialConfigState,
      pipelineTool: {
        config: {
          type: PIPELINE_TOOL_TYPES.BUILD_KITE,
          token: '',
        },
        isVerified: false,
        isShow: false,
        verifiedResponse: {
          pipelineList: [
            {
              id: 'mock id',
              name: 'mock name',
              orgId: 'mock id',
              orgName: 'mock orgName',
              repository: 'mock repository url',
              steps: [],
              branches: [],
              crews: [],
            },
          ],
        },
      },
    };
    const mockParams = {
      organization: '',
      pipelineName: '',
      steps: ['mock steps'],
    };
    const pipelineVerifiedResponse = configReducer(
      mockConfigStateHasPipelineList,
      updatePipelineToolVerifyResponseSteps(mockParams),
    );

    expect(pipelineVerifiedResponse.pipelineTool.verifiedResponse.pipelineList).toEqual([
      {
        id: 'mock id',
        name: 'mock name',
        orgId: 'mock id',
        orgName: 'mock orgName',
        repository: 'mock repository url',
        steps: [],
        branches: [],
        crews: [],
      },
    ]);
  });

  it('should return empty pipelineList when get pipelineTool steps given pipelineList is empty', () => {
    const mockParams = {
      organization: MOCK_BUILD_KITE_VERIFY_RESPONSE.pipelineList[0].orgName,
      pipelineName: MOCK_BUILD_KITE_VERIFY_RESPONSE.pipelineList[0].name,
      steps: ['mock steps'],
    };
    const pipelineVerifiedResponse = configReducer(
      initialConfigState,
      updatePipelineToolVerifyResponseSteps(mockParams),
    );

    expect(pipelineVerifiedResponse.pipelineTool.verifiedResponse.pipelineList).toEqual([]);
  });

  describe('pipelineToolVerifyResponse reducer', () => {
    it('should show empty array when handle initial state', () => {
      const pipelineVerifiedResponse = configReducer(undefined, { type: 'unknown' });

      expect(pipelineVerifiedResponse.pipelineTool.verifiedResponse.pipelineList).toEqual([]);
    });

    it('should store pipelineTool data when get network pipelineTool verify response', () => {
      const pipelineVerifiedResponse = configReducer(
        initialConfigState,
        updatePipelineToolVerifyResponse(MOCK_BUILD_KITE_VERIFY_RESPONSE),
      );

      expect(pipelineVerifiedResponse.pipelineTool.verifiedResponse.pipelineList).toEqual([
        {
          id: 'mock id',
          name: 'mock name',
          orgId: 'mock id',
          orgName: 'mock orgName',
          repository: 'mock repository url',
          steps: [],
        },
      ]);
    });
  });

  describe('selectPipelineNames', () => {
    it('should return PipelineNames when call selectPipelineNames function', async () => {
      const store = setupStore();
      await store.dispatch(updatePipelineToolVerifyResponse(MOCK_PIPElINE_TOOL_VERIFY_RESPONSE));
      expect(selectPipelineNames(store.getState(), 'mockOrgName')).toEqual(['mockName']);
    });

    it('should sort PipelineNames when call selectPipelineNames function', async () => {
      const store = setupStore();
      await store.dispatch(updatePipelineToolVerifyResponse(MOCK_PIPElINE_TOOL_VERIFY_RESPONSE_SORT));
      expect(selectPipelineNames(store.getState(), 'mockOrgName')).toEqual(['mockName', 'MockName']);
    });
  });

  describe('selectStepsParams', () => {
    let store = setupStore();
    beforeEach(async () => {
      store = setupStore();
      await store.dispatch(updatePipelineToolVerifyResponse(MOCK_PIPElINE_TOOL_VERIFY_RESPONSE));
      await store.dispatch(updateDateRange(MOCK_DATE_RANGE));
    });

    it('should return true StepsParams when call selectStepsParams function given right organization name and pipeline name', async () => {
      expect(selectStepsParams(store.getState(), 'mockOrgName', 'mockName')).toEqual({
        buildId: 'mockId',
        organizationId: 'mockOrgId',
        params: [
          {
            endTime: dayjs(MOCK_DATE_RANGE[0].endDate).endOf('date').valueOf(),
            orgName: 'mockOrgName',
            pipelineName: 'mockName',
            repository: 'mockRepository',
            startTime: dayjs(MOCK_DATE_RANGE[0].startDate).startOf('date').valueOf(),
          },
        ],
        pipelineType: 'BuildKite',
        token: '',
      });
    });

    it('should return StepsParams when call selectStepsParams function given empty organization name and empty pipeline name', async () => {
      expect(selectStepsParams(store.getState(), '', '')).toEqual({
        buildId: '',
        organizationId: '',
        params: [
          {
            endTime: dayjs(MOCK_DATE_RANGE[0].endDate).endOf('date').valueOf(),
            orgName: '',
            pipelineName: '',
            repository: '',
            startTime: dayjs(MOCK_DATE_RANGE[0].startDate).startOf('date').valueOf(),
          },
        ],
        pipelineType: 'BuildKite',
        token: '',
      });
    });
  });

  describe('selectSteps', () => {
    it('should return steps when call selectSteps function', async () => {
      const store = setupStore();
      await store.dispatch(updatePipelineToolVerifyResponse(MOCK_PIPElINE_TOOL_VERIFY_RESPONSE));
      expect(selectSteps(store.getState(), 'mockOrgName', 'mockName')).toEqual([]);
    });
  });

  describe('selectPipelineOrganizations', () => {
    it('should return organizations when call selectPipelineOrganizations function', async () => {
      const store = setupStore();
      await store.dispatch(updatePipelineToolVerifyResponse(MOCK_PIPElINE_TOOL_VERIFY_RESPONSE));
      expect(selectPipelineOrganizations(store.getState())).toEqual(['mockOrgName']);
    });
  });
});
