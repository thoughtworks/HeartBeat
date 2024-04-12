export const importInputWrongProjectFromFile = {
  projectName: '',
  dateRange: {
    startDate: '2024-02-12T00:00:00.000+08:00',
    endDate: '2024-02-16T23:59:59.999+08:00',
  },
  calendarType: 'Calendar with Chinese Holiday',
  metrics: [
    'Velocity',
    'Cycle time',
    'Classification',
    'Lead time for changes',
    'Deployment frequency',
    'Change failure rate',
    'Mean time to recovery',
  ],
  board: {
    type: 'Classic Jira',
    boardId: '2',
    email: 'heartbeatuser2023@gmail.com',
    projectKey: 'ADM',
    site: 'dorametrics',
    token: process.env.E2E_WRONG_TOKEN_JIRA,
  },
  pipelineTool: {
    type: 'BuildKite',
    token: process.env.E2E_WRONG_TOKEN_BUILD_KITE,
  },
  sourceControl: {
    type: 'GitHub',
    token: process.env.E2E_WRONG_TOKEN_GITHUB,
  },
  crews: [],
  assigneeFilter: 'lastAssignee',
  pipelineCrews: ['heartbeat-user', 'guzhongren', 'Unknown'],
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
    treatFlagCardAsBlock: true,
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
  deployment: [
    {
      id: 0,
      organization: 'Thoughtworks-Heartbeat',
      pipelineName: 'Heartbeat',
      step: ':rocket: Deploy prod',
      branches: ['main', 'ADM-747'],
    },
  ],
};

export const importModifiedCorrectConfig = {
  projectName: 'Heartbeat Metrics',
  deletedBranch: 'ADM-747',
  dateRange: {
    startDate: '2024-01-15T00:00:00.000+08:00',
    endDate: '2024-01-19T23:59:59.999+08:00',
  },
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
        Done: '--',
      },
    ],
    treatFlagCardAsBlock: true,
  },
  doneStatus: ['DONE'],
  deployment: [
    {
      id: 0,
      organization: 'Thoughtworks-Heartbeat',
      pipelineName: 'Heartbeat',
      step: ':rocket: Deploy prod',
      branches: ['main'],
    },
  ],
  reworkTimesSettings: {
    excludeStates: [],
    reworkState: 'In Dev',
  },
};
