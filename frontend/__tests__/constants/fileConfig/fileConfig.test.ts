import {
  IMPORTED_NEW_CONFIG_FIXTURE,
  BASIC_IMPORTED_OLD_CONFIG_FIXTURE,
  REGULAR_CALENDAR,
  CHINA_CALENDAR,
} from '../../fixtures';
import { convertToNewFileConfig } from '@src/constants/fileConfig';

describe('#fileConfig', () => {
  const BASIC_NEW_CONFIG = {
    projectName: 'ConfigFileForImporting',
    dateRange: {
      startDate: '2023-03-16T00:00:00.000+08:00',
      endDate: '2023-03-30T23:59:59.999+08:00',
    },
    metrics: ['Velocity', 'Cycle time', 'Classification', 'Lead time for changes'],
    board: {
      type: 'Classic Jira',
      boardId: '1963',
      token: 'mockToken',
      site: 'mockSite',
      email: 'test@test.com',
      projectKey: 'PLL',
    },
    pipelineTool: {
      type: 'BuildKite',
      token: 'mockToken',
    },
    sourceControl: {
      type: 'GitHub',
      token: '',
    },
    crews: ['lucy', 'hi hi', 'Yu Zhang'],
    classification: ['type', 'Parent'],
    cycleTime: {},
    doneStatus: ['DONE'],
    deployment: [
      {
        branches: undefined,
        id: 0,
        pipelineName: 'Heartbeat',
        step: ':rocket: Deploy prod',
        organization: 'Thoughtworks-Heartbeat',
      },
    ],
  };

  it('should return original config when it is not old config', () => {
    expect(convertToNewFileConfig(IMPORTED_NEW_CONFIG_FIXTURE)).toEqual(IMPORTED_NEW_CONFIG_FIXTURE);
  });

  it('should convert to new config when it is old config and considerHoliday is false', () => {
    const expected = {
      ...BASIC_NEW_CONFIG,
      calendarType: REGULAR_CALENDAR,
    };
    expect(
      convertToNewFileConfig({
        ...BASIC_IMPORTED_OLD_CONFIG_FIXTURE,
        considerHoliday: false,
      }),
    ).toEqual(expected);
  });

  it('should convert to new config when it is old config and considerHoliday is true', () => {
    const expected = {
      ...BASIC_NEW_CONFIG,
      calendarType: CHINA_CALENDAR,
    };
    expect(
      convertToNewFileConfig({
        ...BASIC_IMPORTED_OLD_CONFIG_FIXTURE,
        considerHoliday: true,
      }),
    ).toEqual(expected);
  });
});
