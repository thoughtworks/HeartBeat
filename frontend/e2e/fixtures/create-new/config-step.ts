export const config = {
  projectName: 'Heartbeat Metrics',
  dateRange: [
    {
      startDate: '2024-01-15T00:00:00.000+08:00',
      endDate: '2024-01-19T23:59:59.999+08:00',
    },
  ],
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
  sourceControl: {
    type: 'GitHub',
    token: process.env.E2E_TOKEN_GITHUB as string,
  },
};
