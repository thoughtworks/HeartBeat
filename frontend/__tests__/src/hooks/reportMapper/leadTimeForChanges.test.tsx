import { leadTimeForChangesMapper } from '@src/hooks/reportMapper/leadTimeForChanges'

describe('lead time for changes data mapper', () => {
  const mockLeadTimeForChangesRes = {
    leadTimeForChangesOfPipelines: [
      {
        name: 'fs-platform-payment-selector',
        step: 'RECORD RELEASE TO PROD',
        mergeDelayTime: 2702.53,
        pipelineDelayTime: 2587.42,
        totalDelayTime: 5289.95,
      },
    ],
    avgLeadTimeForChanges: {
      name: 'Average',
      mergeDelayTime: 3647.51,
      pipelineDelayTime: 2341.72,
      totalDelayTime: 5989.22,
    },
  }
  it('maps response lead time for changes values to ui display value', () => {
    const expectedLeadTimeForChangesValues = [
      {
        id: 0,
        name: 'fs-platform-payment-selector/RECORD RELEASE TO PROD',
        valuesList: [
          { name: 'mergeDelayTime', value: '1day 21hours 2minutes' },
          { name: 'pipelineDelayTime', value: '1day 19hours 7minutes' },
          { name: 'totalDelayTime', value: '3day 16hours 9minutes' },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          { name: 'mergeDelayTime', value: '2day 12hours 47minutes' },
          { name: 'pipelineDelayTime', value: '1day 15hours 1minutes' },
          { name: 'totalDelayTime', value: '4day 3hours 49minutes' },
        ],
      },
    ]
    const mappedLeadTimeForChanges = leadTimeForChangesMapper(mockLeadTimeForChangesRes)

    expect(mappedLeadTimeForChanges).toEqual(expectedLeadTimeForChangesValues)
  })
})
