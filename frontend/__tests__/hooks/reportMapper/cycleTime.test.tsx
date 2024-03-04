import { cycleTimeMapper } from '@src/hooks/reportMapper/cycleTime';

describe('cycleTime data mapper', () => {
  const mockCycleTimeRes = {
    totalTimeForCards: 423.59,
    averageCycleTimePerSP: 21.18,
    averageCycleTimePerCard: 30.26,
    swimlaneList: [
      {
        optionalItemName: 'In Dev',
        averageTimeForSP: 12.13,
        averageTimeForCards: 17.32,
        totalTime: 242.51,
      },
      {
        optionalItemName: 'Waiting for testing',
        averageTimeForSP: 0.16,
        averageTimeForCards: 0.23,
        totalTime: 3.21,
      },
    ],
  };
  it('maps response cycleTime values to ui display value', () => {
    const expectedCycleValues = [
      {
        id: 0,
        name: 'Average cycle time',
        valueList: [
          { value: 21.18, unit: '(Days/SP)' },
          { value: '30.26', unit: '(Days/Card)' },
        ],
      },
      { id: 1, name: 'Total development time / Total cycle time', valueList: [{ value: '57.25%' }] },
      { id: 2, name: 'Total waiting for testing time / Total cycle time', valueList: [{ value: '0.76%' }] },
      {
        id: 3,
        name: 'Average development time',
        valueList: [
          { value: '12.13', unit: '(Days/SP)' },
          { value: '17.32', unit: '(Days/Card)' },
        ],
      },
      {
        id: 4,
        name: 'Average waiting for testing time',
        valueList: [
          { value: '0.16', unit: '(Days/SP)' },
          { value: '0.23', unit: '(Days/Card)' },
        ],
      },
    ];
    const mappedCycleValues = cycleTimeMapper(mockCycleTimeRes);

    expect(mappedCycleValues).toEqual(expectedCycleValues);
  });
});
