import configReducer, {
  resetImportedData,
  selectSteps,
  updateCalendarType,
  updateDateRange,
  updateMetrics,
  updateProjectCreatedState,
  updateProjectName,
} from '@src/context/config/configSlice';
import { CHINA_CALENDAR, CONFIG_PAGE_VERIFY_IMPORT_ERROR_MESSAGE, REGULAR_CALENDAR, VELOCITY } from '../fixtures';
import { setupStore } from '@test/utils/setupStoreUtil';
import initialConfigState from '../initialConfigState';

const MockBasicState = {
  projectName: 'Test Project',
  dateRange: {
    startDate: new Date(),
    endDate: new Date(),
  },
  metrics: ['Velocity', 'Cycle time'],
};
describe('config reducer', () => {
  it('should be default value when init render config page', () => {
    const config = configReducer(undefined, { type: 'unknown' }).basic;

    expect(config.projectName).toEqual('');
    expect(config.calendarType).toEqual(REGULAR_CALENDAR);
    expect(config.dateRange).toEqual({ startDate: null, endDate: null });
  });

  it('should update project name when change project name input', () => {
    const config = configReducer(initialConfigState, updateProjectName('mock project name')).basic;

    expect(config.projectName).toEqual('mock project name');
  });

  it('should update calendar when change calendar types', () => {
    const config = configReducer(initialConfigState, updateCalendarType(CHINA_CALENDAR)).basic;

    expect(config.calendarType).toEqual(CHINA_CALENDAR);
  });

  it('should update date range when change date', () => {
    const today = new Date().getMilliseconds();
    const config = configReducer(initialConfigState, updateDateRange({ startDate: today, endDate: '' })).basic;

    expect(config.dateRange.startDate).toEqual(today);
    expect(config.dateRange.endDate).toEqual('');
  });

  it('should isProjectCreated is false when import file', () => {
    const config = configReducer(initialConfigState, updateProjectCreatedState(false));

    expect(config.isProjectCreated).toEqual(false);
  });

  it('should update required data when change require data selections', () => {
    const config = configReducer(initialConfigState, updateMetrics([VELOCITY])).basic;

    expect(config.metrics).toEqual([VELOCITY]);
  });

  it('should set warningMessage when metrics data not include in REQUIRED_DATA', () => {
    const initialState = {
      ...initialConfigState,
      isProjectCreated: false,
    };
    const action = {
      type: 'config/updateBasicConfigState',
      payload: { ...MockBasicState, metrics: ['Metric 1', 'Metric 2'] },
    };

    const config = configReducer(initialState, action);

    expect(config.warningMessage).toBe(CONFIG_PAGE_VERIFY_IMPORT_ERROR_MESSAGE);
  });

  it('should not set warningMessage when projectName startDate endDate and metrics data have value', () => {
    const initialState = {
      ...initialConfigState,
      isProjectCreated: false,
    };
    const action = {
      type: 'config/updateBasicConfigState',
      payload: MockBasicState,
    };

    const config = configReducer(initialState, action);

    expect(config.warningMessage).toBeNull();
  });

  it('should reset ImportedData when input new config', () => {
    const initialState = initialConfigState;

    const config = configReducer(initialState, resetImportedData());

    expect(config).toEqual(initialConfigState);
  });

  it.each([
    ['projectName', { ...MockBasicState, projectName: '' }],
    ['startDate', { ...MockBasicState, dateRange: { startDate: '' } }],
    ['endDate', { ...MockBasicState, dateRange: { endDate: '' } }],
    ['metrics', { ...MockBasicState, metrics: [] }],
  ])('should show warning message when only %s empty', (_, payload) => {
    const initialState = {
      ...initialConfigState,
      isProjectCreated: false,
    };
    const action = {
      type: 'config/updateBasicConfigState',
      payload,
    };

    const config = configReducer(initialState, action);

    expect(config.warningMessage).toEqual(CONFIG_PAGE_VERIFY_IMPORT_ERROR_MESSAGE);
  });

  it('should return empty given steps not exists in pipelineList', () => {
    const store = setupStore();
    expect(selectSteps(store.getState(), 'mockOrgName', 'mockName')).toEqual([]);
  });
});
