import {
  convertCycleTimeSettings,
  exportToJsonFile,
  filterAndMapCycleTimeSettings,
  findCaseInsensitiveType,
  formatDuplicatedNameWithSuffix,
  formatMillisecondsToHours,
  formatMinToHours,
  getDisabledOptions,
  getJiraBoardToken,
  getRealDoneStatus,
  getSortedAndDeduplicationBoardingMapping,
  sortDisabledOptions,
  transformToCleanedBuildKiteEmoji,
} from '@src/utils/util';
import { CleanedBuildKiteEmoji, OriginBuildKiteEmoji } from '@src/constants/emojis/emoji';
import { CYCLE_TIME_SETTINGS_TYPES, METRICS_CONSTANTS } from '@src/constants/resources';
import { ICycleTimeSetting, IPipelineConfig } from '@src/context/Metrics/metricsSlice';
import { EMPTY_STRING } from '@src/constants/commons';
import { PIPELINE_TOOL_TYPES } from '../fixtures';

describe('exportToJsonFile function', () => {
  it('should create a link element with the correct attributes and click it', () => {
    const filename = 'test';
    const json = { key: 'value' };
    const documentCreateSpy = jest.spyOn(document, 'createElement');

    exportToJsonFile(filename, json);

    expect(documentCreateSpy).toHaveBeenCalledWith('a');
  });
});

describe('transformToCleanedBuildKiteEmoji function', () => {
  it('should transform to cleaned emoji', () => {
    const mockOriginEmoji: OriginBuildKiteEmoji = {
      name: 'zap',
      image: 'abc.com',
      aliases: [],
    };

    const expectedCleanedEmoji: CleanedBuildKiteEmoji = {
      image: 'abc.com',
      aliases: ['zap'],
    };

    const [result] = transformToCleanedBuildKiteEmoji([mockOriginEmoji]);

    expect(result).toEqual(expectedCleanedEmoji);
  });
});

describe('getDisabledOptions function', () => {
  it('should return true when option is includes', () => {
    const mockDeploymentFrequencySettings: IPipelineConfig[] = [
      { id: 0, organization: '', pipelineName: 'mock 1', step: '', branches: [] },
      { id: 1, organization: '', pipelineName: 'mock 2', step: '', branches: [] },
    ];

    const mockOption: string = 'mock 1';

    const result = getDisabledOptions(mockDeploymentFrequencySettings, mockOption);

    expect(result).toBeTruthy();
  });

  it('should return true when option is not includes', () => {
    const mockDeploymentFrequencySettings: IPipelineConfig[] = [
      { id: 0, organization: '', pipelineName: 'mock 1', step: '', branches: [] },
      { id: 1, organization: '', pipelineName: 'mock 2', step: '', branches: [] },
    ];

    const mockOption: string = 'mock 3';

    const result = getDisabledOptions(mockDeploymentFrequencySettings, mockOption);

    expect(result).toBeFalsy();
  });
});

describe('sortDisabledOptions function', () => {
  it('should sort the mock3 is first when mock1 & mock2 is selected', () => {
    const mockDeploymentFrequencySettings: IPipelineConfig[] = [
      { id: 0, organization: '', pipelineName: 'mock1', step: '', branches: [] },
      { id: 1, organization: '', pipelineName: 'mock2', step: '', branches: [] },
    ];

    const mockOptions = ['mock1', 'mock2', 'mock3'];

    const result = sortDisabledOptions(mockDeploymentFrequencySettings, mockOptions);

    expect(result).toEqual(['mock3', 'mock1', 'mock2']);
  });

  it('should not sort when deploymentFrequencySettings is empty', () => {
    const mockDeploymentFrequencySettings: IPipelineConfig[] = [];

    const mockOptions = ['mock1', 'mock2', 'mock3'];

    const result = sortDisabledOptions(mockDeploymentFrequencySettings, mockOptions);

    expect(result).toEqual(['mock1', 'mock2', 'mock3']);
  });

  it('should as is when selected option is last', () => {
    const mockDeploymentFrequencySettings: IPipelineConfig[] = [
      { id: 0, organization: '', pipelineName: 'mock3', step: '', branches: [] },
    ];

    const mockOptions = ['mock1', 'mock2', 'mock3'];

    const result = sortDisabledOptions(mockDeploymentFrequencySettings, mockOptions);

    expect(result).toEqual(['mock1', 'mock2', 'mock3']);
  });
});

describe('getJiraToken function', () => {
  it('should return an valid string when token is not empty string', () => {
    const email = 'test@example.com';
    const token = 'myToken';

    const jiraToken = getJiraBoardToken(token, email);
    const encodedMsg = `Basic ${btoa(`${email}:${token}`)}`;

    expect(jiraToken).toBe(encodedMsg);
  });

  it('should return an empty string when token is missing', () => {
    const email = 'test@example.com';
    const token = '';

    const jiraToken = getJiraBoardToken(token, email);

    expect(jiraToken).toBe('');
  });
});

describe('findCaseInsensitiveType function', () => {
  it('Should return "BuildKite" when passing a type given case insensitive input bUildkite', () => {
    const selectedValue = 'bUildkite';
    const value = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), selectedValue);
    expect(value).toBe(PIPELINE_TOOL_TYPES.BUILD_KITE);
  });

  it('Should return "_BuildKite" when passing a type given the value mismatches with PIPELINE_TOOL_TYPES', () => {
    const selectedValue = '_BuildKite';
    const value = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), selectedValue);
    expect(value).not.toBe(PIPELINE_TOOL_TYPES.BUILD_KITE);
    expect(value).toBe(selectedValue);
  });

  it('Should return empty string when passing a type given empty string', () => {
    const selectedValue = '';
    const value = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), selectedValue);
    expect(value).toBe(EMPTY_STRING);
  });
});

describe('filterAndMapCycleTimeSettings function', () => {
  it('should filter and map CycleTimeSettings when generate report', () => {
    const MOCK_CYCLE_TIME_SETTING = [
      { column: 'TODO', status: 'ToDo', value: 'TODO' },
      { column: 'TODO', status: 'Backlog', value: 'TODO' },
      { column: 'IN DEV', status: 'InDev', value: 'IN DEV' },
      { column: 'IN DEV', status: 'Doing', value: 'IN DEV' },
      { column: 'DONE', status: 'Done', value: 'DONE' },
    ];
    const value = filterAndMapCycleTimeSettings(MOCK_CYCLE_TIME_SETTING);

    expect(value).toStrictEqual([
      { name: 'ToDo', value: 'TODO' },
      { name: 'Backlog', value: 'TODO' },
      { name: 'InDev', value: 'IN DEV' },
      { name: 'Doing', value: 'IN DEV' },
      { name: 'Done', value: 'DONE' },
    ]);
  });

  it('Should return 2 hours when passing a min', () => {
    const expected = 2;
    const result = formatMinToHours(120);
    expect(result).toEqual(expected);
  });

  it('Should return 2 hours when passing a Milliseconds', () => {
    const expected = 2;
    const result = formatMillisecondsToHours(7200000);
    expect(result).toEqual(expected);
  });
});

const MOCK_CYCLE_TIME_SETTING_With_ONE_DONE = [
  { column: 'TODO', status: 'ToDo', value: 'TODO' },
  { column: 'TODO', status: 'Backlog', value: 'TODO' },
  { column: 'IN DEV', status: 'InDev', value: 'IN DEV' },
  { column: 'IN DEV', status: 'Doing', value: 'IN DEV' },
  { column: 'DONE', status: 'DONE', value: 'Done' },
];

const MOCK_CYCLE_TIME_SETTING_WITH_MUTIPLE_DONE = [
  { column: 'TODO', status: 'ToDo', value: 'TODO' },
  { column: 'TODO', status: 'Backlog', value: 'TODO' },
  { column: 'IN DEV', status: 'InDev', value: 'IN DEV' },
  { column: 'IN DEV', status: 'Doing', value: 'Done' },
  { column: 'DONE', status: 'DONE', value: 'Done' },
];

describe('getRealDoneStatus', () => {
  it('should return selected done status given cycle time settings only one done value and type is by column', () => {
    const result = getRealDoneStatus(MOCK_CYCLE_TIME_SETTING_With_ONE_DONE, CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN, []);

    expect(result).toEqual(['DONE']);
  });

  it('should return selected done status given cycle time settings only one done value and type is by status', () => {
    const result = getRealDoneStatus(MOCK_CYCLE_TIME_SETTING_With_ONE_DONE, CYCLE_TIME_SETTINGS_TYPES.BY_STATUS, []);

    expect(result).toEqual(['DONE']);
  });

  it('should return status from real done settings given cycle time settings type is by column', () => {
    const result = getRealDoneStatus(MOCK_CYCLE_TIME_SETTING_WITH_MUTIPLE_DONE, CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN, [
      'Doing',
    ]);

    expect(result).toEqual(['Doing']);
  });

  it('should return selected done status given cycle time settings type is by column', () => {
    const result = getRealDoneStatus(MOCK_CYCLE_TIME_SETTING_WITH_MUTIPLE_DONE, CYCLE_TIME_SETTINGS_TYPES.BY_STATUS, [
      'something',
    ]);

    expect(result).toEqual(['Doing', 'DONE']);
  });
});

describe('formatDuplicatedNameWithSuffix function', () => {
  it('should add suffix for duplicated name', () => {
    const duplicatedName = 'Story testing';
    const basicTargetFields = [
      { flag: true, key: 'issue', name: 'Issue' },
      { flag: false, key: 'type', name: 'Type' },
    ];
    const mockTargetFields = [
      ...basicTargetFields,
      { flag: true, key: 'custom_field10060', name: duplicatedName },
      { flag: false, key: 'custom_field10061', name: duplicatedName },
    ];

    const result = formatDuplicatedNameWithSuffix(mockTargetFields);

    const expectResult = [
      ...basicTargetFields,
      { flag: true, key: 'custom_field10060', name: `${duplicatedName}-1` },
      { flag: false, key: 'custom_field10061', name: `${duplicatedName}-2` },
    ];
    expect(result).toStrictEqual(expectResult);
  });
});

describe('getSortedAndDeduplicationBoardingMapping function', () => {
  it('should sorted and deduplication boarding mapping', () => {
    const boardingMapping: ICycleTimeSetting[] = [
      METRICS_CONSTANTS.cycleTimeEmptyStr,
      METRICS_CONSTANTS.analysisValue,
      METRICS_CONSTANTS.testingValue,
      METRICS_CONSTANTS.doneValue,
      METRICS_CONSTANTS.todoValue,
      METRICS_CONSTANTS.cycleTimeEmptyStr,
      METRICS_CONSTANTS.blockValue,
      METRICS_CONSTANTS.inDevValue,
      METRICS_CONSTANTS.reviewValue,
      METRICS_CONSTANTS.waitingValue,
      METRICS_CONSTANTS.reviewValue,
    ].map((value) => ({
      value: value,
      status: '',
      column: '',
    }));
    const expectResult = [
      METRICS_CONSTANTS.cycleTimeEmptyStr,
      METRICS_CONSTANTS.todoValue,
      METRICS_CONSTANTS.analysisValue,
      METRICS_CONSTANTS.inDevValue,
      METRICS_CONSTANTS.blockValue,
      METRICS_CONSTANTS.reviewValue,
      METRICS_CONSTANTS.waitingValue,
      METRICS_CONSTANTS.testingValue,
      METRICS_CONSTANTS.doneValue,
    ];
    const result = getSortedAndDeduplicationBoardingMapping(boardingMapping);
    expect(result).toStrictEqual(expectResult);
  });
});

describe('convertCycleTimeSettings function', () => {
  const mockCycleTime = [
    {
      column: 'TODO',
      status: 'TODO',
      value: 'To do',
    },
    {
      column: 'Doing',
      status: 'DOING',
      value: 'In Dev',
    },
    {
      column: 'Blocked',
      status: 'BLOCKED',
      value: 'Block',
    },
    {
      column: 'Review',
      status: 'REVIEW',
      value: 'Review',
    },
    {
      column: 'READY FOR TESTING',
      status: 'WAIT FOR TEST',
      value: 'Waiting for testing',
    },
    {
      column: 'Testing',
      status: 'TESTING',
      value: 'Testing',
    },
    {
      column: 'Done',
      status: 'DONE',
      value: '',
    },
  ];
  it('convert cycle time settings correctly by status', () => {
    const expectResult = [
      {
        TODO: 'To do',
      },
      {
        DOING: 'In Dev',
      },
      {
        BLOCKED: 'Block',
      },
      {
        REVIEW: 'Review',
      },
      {
        'WAIT FOR TEST': 'Waiting for testing',
      },
      {
        TESTING: 'Testing',
      },
      {
        DONE: '',
      },
    ];
    const result = convertCycleTimeSettings(CYCLE_TIME_SETTINGS_TYPES.BY_STATUS, mockCycleTime);
    expect(result).toStrictEqual(expectResult);
  });
  it('convert cycle time settings correctly by column', () => {
    const expectResult = [
      {
        TODO: 'To do',
      },
      {
        Doing: 'In Dev',
      },
      {
        Blocked: 'Block',
      },
      {
        Review: 'Review',
      },
      {
        'READY FOR TESTING': 'Waiting for testing',
      },
      {
        Testing: 'Testing',
      },
      {
        Done: '----',
      },
    ];
    const result = convertCycleTimeSettings(CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN, mockCycleTime);
    expect(result).toStrictEqual(expectResult);
  });
});
