import { cycleTimeMapper } from '@src/hooks/reportMapper/cycleTime'

describe('cycleTime data mapper', () => {
  const mockCycleTimeRes = {
    totalTimeForCards: 423.59,
    averageCycleTimePerSP: '21.18',
    averageCircleTimePerCard: '30.26',
    swimlaneList: [
      {
        optionalItemName: 'In Dev',
        averageTimeForSP: '12.13',
        averageTimeForCards: '17.32',
        totalTime: '242.51',
      },
      {
        optionalItemName: 'Waiting for testing',
        averageTimeForSP: '0.16',
        averageTimeForCards: '0.23',
        totalTime: '3.21',
      },
    ],
  }
  it('maps response cycleTime values to ui display value', () => {
    const expectedCycleValues = [
      { id: 0, name: 'Average cycle time', valueList: ['21.18(days/SP)', '30.26(days/card)'] },
      { id: 1, name: 'Total development time / Total cycle time', valueList: ['0.57'] },
      { id: 2, name: 'Total waiting for testing time / Total cycle time', valueList: ['0.01'] },
      { id: 3, name: 'Total block time / Total cycle time', valueList: [] },
      { id: 4, name: 'Total review time / Total cycle time', valueList: [] },
      { id: 5, name: 'Total testing time / Total cycle time', valueList: [] },
      { id: 6, name: 'Average development time', valueList: ['12.13(days/SP)', '17.32(days/card)'] },
      { id: 7, name: 'Average waiting for testing time', valueList: ['0.16(days/SP)', '0.23(days/card)'] },
      { id: 8, name: 'Average block time', valueList: [] },
      { id: 9, name: 'Average review time', valueList: [] },
      { id: 10, name: 'Average testing time', valueList: [] },
    ]
    const mappedCycleValues = cycleTimeMapper(mockCycleTimeRes)

    expect(mappedCycleValues).toEqual(expectedCycleValues)
  })
})
