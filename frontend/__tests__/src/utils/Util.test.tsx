import {
  exportToJsonFile,
  filterAndMapCycleTimeSettings,
  findCaseInsensitiveType,
  formatMillisecondsToHours,
  formatMinToHours,
  getJiraBoardToken,
  transformToCleanedBuildKiteEmoji,
} from '@src/utils/util';
import {
  FILTER_CYCLE_TIME_SETTINGS,
  MOCK_CYCLE_TIME_SETTING,
  MOCK_JIRA_WITH_STATUES_SETTING,
  PIPELINE_TOOL_TYPES,
} from '../fixtures';
import { CleanedBuildKiteEmoji, OriginBuildKiteEmoji } from '@src/constants/emojis/emoji';
import { EMPTY_STRING } from '@src/constants/commons';

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

  it('Should return "GoCD" when passing a type given case sensitive input GoCD', () => {
    const selectedValue = 'GoCD';
    const value = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), selectedValue);
    expect(value).toBe(PIPELINE_TOOL_TYPES.GO_CD);
  });

  it('Should return "GoCD" when passing a type given case insensitive input Gocd', () => {
    const selectedValue = 'Gocd';
    const value = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), selectedValue);
    expect(value).toBe(PIPELINE_TOOL_TYPES.GO_CD);
  });

  it('Should return "_BuildKite" when passing a type given the value mismatches with PIPELINE_TOOL_TYPES', () => {
    const selectedValue = '_BuildKite';
    const value = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), selectedValue);
    expect(value).not.toBe(PIPELINE_TOOL_TYPES.BUILD_KITE);
    expect(value).not.toBe(PIPELINE_TOOL_TYPES.GO_CD);
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
    const value = filterAndMapCycleTimeSettings(MOCK_CYCLE_TIME_SETTING, MOCK_JIRA_WITH_STATUES_SETTING);
    expect(value).toStrictEqual(FILTER_CYCLE_TIME_SETTINGS);
  });

  it('should filter and map CycleTimeSettings when generate report', () => {
    const filterCycleTimeSettings = [
      { name: 'IN DEV', value: 'IN DEV' },
      { name: 'DOING', value: 'IN DEV' },
      { name: 'DONE', value: 'DONE' },
    ];

    const MOCK_CYCLE_TIME_SETTING = [
      { name: 'TODO', value: 'TODO' },
      { name: 'IN DEV', value: 'IN DEV' },
      { name: 'DONE', value: 'DONE' },
    ];

    const MOCK_JIRA_WITH_STATUES_SETTING = [
      { name: 'todo', statuses: ['TODO', 'BACKLOG'] },
      { name: 'IN DEV', statuses: ['IN DEV', 'DOING'] },
      { name: 'DONE', statuses: ['DONE'] },
    ];
    const value = filterAndMapCycleTimeSettings(MOCK_CYCLE_TIME_SETTING, MOCK_JIRA_WITH_STATUES_SETTING);
    expect(value).toStrictEqual(filterCycleTimeSettings);
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
