export const MOCK_EMAIL = 'test@test.com'
export const BOARD_TOKEN = 'mockToken'
export const WEB_SITE = 'https://url.com'
export const BOARD_PROJECT_KEY = 'mockProjectKey'

export const GITHUB_TOKEN = `ghp_${'Abc123'.repeat(6)}`

export const JSON_FILE_CONTENT = {
  projectName: 'E2E Project',
  dateRange: {
    startDate: '2023-03-16T00:00:00+08:00',
    endDate: '2023-03-30T00:00:00+08:00',
  },
  calendarType: 'Regular Calendar(Weekend Considered)',
  metrics: [
    'All',
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
    boardId: '1963',
    email: 'test@test.com',
    projectKey: 'PLL',
    site: 'site',
    token: 'mockToken',
  },
  pipelineTool: {
    type: 'BuildKite',
    token: 'mock1234'.repeat(5),
  },
  sourceControl: {
    type: 'GitHub',
    token: GITHUB_TOKEN,
  },
  deployment: [
    {
      id: 0,
      organization: 'XXXX',
      pipelineName: 'fs-platform-payment-selector',
      steps: 'RECORD RELEASE TO PROD',
    },
  ],
  leadTime: [
    {
      id: 0,
      organization: 'XXXX',
      pipelineName: 'fs-platform-onboarding',
      steps: 'RECORD RELEASE TO UAT',
    },
  ],
  crews: [
    'Anthony Tse',
    'Harsh Singal',
    'Mengyang Sun',
    'Brian Ong',
    'Qian Zhang',
    'Gerard Ho',
    'Yonghee Jeon Jeon',
    'Prashant Agarwal',
    'Sumit Narang',
    'HanWei Wang',
    'Yu Zhang',
    'Aaron Camilleri',
    'Peihang Yu',
  ],
  cycleTime: {
    jiraColumns: [
      {
        'In Analysis': '',
      },
      {
        'Ready For Dev': '',
      },
      {
        'In Dev': '',
      },
      {
        Blocked: '',
      },
      {
        'Ready For Test': '',
      },
      {
        'In Test': '',
      },
      {
        'Ready to Deploy': '',
      },
      {
        Done: '',
      },
    ],
    treatFlagCardAsBlock: true,
  },
  classification: [
    'issuetype',
    'customfield_21212',
    'customfield_22466',
    'parent',
    'components',
    'project',
    'reporter',
    'customfield_16400',
    'fixVersions',
    'priority',
    'customfield_16800',
    'labels',
    'customfield_10004',
    'customfield_10007',
    'customfield_10008',
    'assignee',
    'customfield_22203',
    'customfield_21871',
    'customfield_10009',
    'customfield_11700',
    'environment',
    'versions',
    'customfield_22213',
    'customfield_22231',
    'customfield_17000',
    'customfield_16302',
    'customfield_14603',
    'customfield_22229',
    'customfield_22228',
    'customfield_22226',
  ],
}
