export const importFlagAsBlockFile = {
  projectName: 'Wenting-test',
  dateRange: {
    startDate: '2024-01-30T00:00:00.000+08:00',
    endDate: '2024-02-01T23:59:59.999+08:00',
  },
  calendarType: 'Calendar with Chinese Holiday',
  metrics: ['Velocity', 'Cycle time', 'Classification'],
  board: {
    type: 'Jira',
    boardId: '1',
    email: 'wtyan@thoughtworks.com',
    projectKey: 'YT',
    site: 'ywt-testing',
    token: process.env.E2E_TOKEN_FLAG_AS_BLOCK_JIRA,
  },
  crews: ['Wenting Yan'],
  assigneeFilter: 'lastAssignee',
  cycleTime: {
    type: 'byColumn',
    jiraColumns: [
      {
        'To Do': 'To do',
      },
      {
        'In Progress': 'In Dev',
      },
      {
        'IN REVIEW': 'Review',
      },
      {
        TESTING: 'Testing',
      },
      {
        Done: 'Done',
      },
    ],
    treatFlagCardAsBlock: true,
  },
  classification: [
    'issuetype',
    'parent',
    'project',
    'customfield_10021',
    'reporter',
    'labels',
    'assignee',
    'customfield_10030',
  ],
};
