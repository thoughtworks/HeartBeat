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
          { name: 'mergeDelayTime', value: '2702.53' },
          { name: 'pipelineDelayTime', value: '2587.42' },
          { name: 'totalDelayTime', value: '5289.95' },
        ],
      },
      {
        id: 1,
        name: 'Average/',
        valuesList: [
          { name: 'mergeDelayTime', value: '3647.51' },
          { name: 'pipelineDelayTime', value: '2341.72' },
          { name: 'totalDelayTime', value: '5989.22' },
        ],
      },
    ]
    const mappedLeadTimeForChanges = leadTimeForChangesMapper(mockLeadTimeForChangesRes)

    expect(mappedLeadTimeForChanges).toEqual(expectedLeadTimeForChangesValues)
  })
})
