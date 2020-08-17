export const metricsConstant = {
  crewAll: 'All',
  cycleTimeEmptyStr: '----',
  doneValue: 'Done',
  doneKeyFromBackend: 'done',
  todoValue: 'To do',
  analysisValue: 'Analysis',
  inDevValue: 'In Dev',
  blockValue: 'Block',
  waitingValue: 'Waiting for testing',
  testingValue: 'Testing',
  reviewValue: 'Review',
};

export const cycleTimeList = [
  metricsConstant.cycleTimeEmptyStr,
  metricsConstant.todoValue,
  metricsConstant.analysisValue,
  metricsConstant.inDevValue,
  metricsConstant.blockValue,
  metricsConstant.waitingValue,
  metricsConstant.testingValue,
  metricsConstant.reviewValue,
  metricsConstant.doneValue,
];

export const exceptionCode = {
  thereIsNoCardInDoneColumn: 444,
};

export const controlNames = {
  crews: 'crews',
  cycleTime: 'cycleTime',
  doneStatus: 'doneStatus',
  leadTime: 'leadTime',
  jiraColumns: 'jiraColumns',
  treatFlagCardAsBlock: 'treatFlagCardAsBlock',
  classifications: 'classifications',
  deployment: 'deployment',
};
