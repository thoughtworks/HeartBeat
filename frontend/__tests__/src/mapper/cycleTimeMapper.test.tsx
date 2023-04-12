import { cycleTimeMapper } from '@src/mapper/CycleTimeMapper'

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
      { id: 1, name: 'Average Cycle Time', value: ['21.18(days/SP)', '30.26(days/card)'] },
      { id: 2, name: 'Total Development Time/Total Cycle Time', value: ['0.57'] },
      { id: 3, name: 'Total Waiting Time/Total Cycle Time', value: ['0.01'] },
      { id: 4, name: 'Total Block Time/Total Cycle Time', value: [] },
      { id: 5, name: 'Total Review Time/Total Cycle Time', value: [] },
      { id: 6, name: 'Total Testing Time/Total Cycle Time', value: [] },
      { id: 7, name: 'Average Development Time', value: ['12.13(days/SP)', '17.32(days/card)'] },
      { id: 8, name: 'Average Waiting Time', value: ['0.16(days/SP)', '0.23(days/card)'] },
      { id: 9, name: 'Average Block Time', value: [] },
      { id: 10, name: 'Average Review Time', value: [] },
      { id: 11, name: 'Average Testing Time', value: [] },
    ]
    const mappedCycleValues = cycleTimeMapper(mockCycleTimeRes)

    expect(mappedCycleValues).toEqual(expectedCycleValues)
  })
})
