export const config = {
  projectName: 'Heartbeat Metrics',
  dateRange: [
    {
      startDate: '2024-01-15T00:00:00.000+08:00',
      endDate: '2024-01-19T23:59:59.999+08:00',
    },
  ],
  sortType: 'DEFAULT',
  calendarType: 'Calendar with Chinese Holiday',
  metrics: [
    'Velocity',
    'Cycle time',
    'Classification',
    'Rework times',
    'Lead time for changes',
    'Deployment frequency',
    'Dev change failure rate',
    'Dev mean time to recovery',
  ],
  board: {
    type: 'Jira',
    boardId: '2',
    email: 'heartbeatuser2023@gmail.com',
    site: 'dorametrics',
    token: process.env.E2E_TOKEN_JIRA as string,
  },
  pipelineTool: {
    type: 'BuildKite',
    token: process.env.E2E_TOKEN_BUILD_KITE as string,
  },
  reworkTimesSettings: {
    excludeStates: [] as string[],
    reworkState: 'In Dev' as string,
  },
  sourceControl: {
    type: 'GitHub',
    token: process.env.E2E_TOKEN_GITHUB as string,
  },
  crews: [
    'heartbeat user',
    'Weiran Sun',
    'Yufan Wang',
    'Chao Wang',
    'Xinyi Wang',
    'Xuebing Li',
    'Junbo Dai',
    'Yunsong Yang',
  ],
  assigneeFilter: 'lastAssignee',
  pipelineCrews: ['guzhongren', 'heartbeat-user', 'Unknown'],
  cycleTime: {
    type: 'byColumn',
    jiraColumns: [
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
        Done: 'Done',
      },
    ],
    treatFlagCardAsBlock: false,
  },
  doneStatus: ['DONE'],
  classification: [
    'issuetype',
    'parent',
    'customfield_10061',
    'customfield_10020',
    'project',
    'customfield_10021',
    'fixVersions',
    'priority',
    'customfield_10037',
    'labels',
    'timetracking',
    'customfield_10016',
    'customfield_10038',
    'assignee',
    'customfield_10027',
    'customfield_10060',
  ],
  advancedSettings: null,
  deployment: [
    {
      id: 0,
      organization: 'Thoughtworks-Heartbeat',
      pipelineName: 'Heartbeat',
      step: ':rocket: Deploy prod',
      branches: ['main'],
    },
  ],
};

export const modifiedConfig = {
  projectName: 'Heartbeat Metrics',
  dateRange: {
    startDate: '2024-01-15T00:00:00.000+08:00',
    endDate: '2024-01-19T23:59:59.999+08:00',
  },
  sortType: 'DEFAULT',
  calendarType: 'Calendar with Chinese Holiday',
  metrics: [
    'Velocity',
    'Cycle time',
    'Classification',
    'Lead time for changes',
    'Deployment frequency',
    'Dev change failure rate',
    'Dev mean time to recovery',
  ],
  board: {
    type: 'Jira',
    boardId: '2',
    email: 'heartbeatuser2023@gmail.com',
    site: 'dorametrics',
    token: process.env.E2E_TOKEN_JIRA as string,
  },
  pipelineTool: {
    type: 'BuildKite',
    token: process.env.E2E_TOKEN_BUILD_KITE as string,
  },
  reworkTimesSettings: {
    excludeStates: ['Block', 'Testing'] as string[],
    reworkState: 'To do' as string,
  },
  sourceControl: {
    type: 'GitHub',
    token: process.env.E2E_TOKEN_GITHUB as string,
  },
  crews: ['heartbeat user', 'Weiran Sun'],
  assigneeFilter: 'lastAssignee',
  pipelineCrews: ['guzhongren', 'heartbeat-user'],
  cycleTime: {
    type: 'byStatus',
    jiraColumns: [
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
        Testing: 'Testing',
      },
      {
        Done: 'Done',
      },
    ],
    treatFlagCardAsBlock: true,
  },
  doneStatus: ['DONE'],
  classification: ['issuetype', 'parent', 'customfield_10061'],
  deployment: [
    {
      id: 0,
      organization: 'Thoughtworks-Heartbeat',
      pipelineName: 'Heartbeat',
      step: ':rocket: Deploy prod',
      branches: ['main', 'gh-pages'],
    },
  ],
};

export const configWithoutBlockColumn = {
  crews: ['Shiqi Yuan'],
  cycleTime: {
    type: 'byColumn',
    jiraColumns: [
      {
        'TO DO': 'To do',
      },
      {
        'IN DEV': 'In Dev',
      },
      {
        'WAITING FOR TESTING': 'Waiting for testing',
      },
      {
        Done: 'Done',
      },
    ],
  },
  reworkTimesSettings: { excludeStates: [], reworkState: 'In Dev' },
};
