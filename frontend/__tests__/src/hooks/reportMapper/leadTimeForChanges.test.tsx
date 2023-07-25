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

  it('should map time to 1 minute when pipelineDelayTime is greater than 0 but less than 1', () => {
    const mockLeadTimeForChangesResMock = {
      leadTimeForChangesOfPipelines: [
        {
          name: 'fs-platform-payment-selector',
          step: 'RECORD RELEASE TO PROD',
          mergeDelayTime: 2639.42,
          pipelineDelayTime: 0.49,
          totalDelayTime: 3289.95,
        },
      ],
      avgLeadTimeForChanges: {
        name: 'Average',
        mergeDelayTime: 2341.72,
        pipelineDelayTime: 0.99,
        totalDelayTime: 2342.71,
      },
    }

    const expectedLeadTimeForChangesValues = [
      {
        id: 0,
        name: 'fs-platform-payment-selector/RECORD RELEASE TO PROD',
        valuesList: [
          { name: 'mergeDelayTime', value: '1day 19hours 59minutes' },
          { name: 'pipelineDelayTime', value: '1minutes' },
          { name: 'totalDelayTime', value: '1day 20hours 0minutes' },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          { name: 'mergeDelayTime', value: '1day 15hours 1minutes' },
          { name: 'pipelineDelayTime', value: '1minutes' },
          { name: 'totalDelayTime', value: '1day 15hours 2minutes' },
        ],
      },
    ]
    const mappedLeadTimeForChanges = leadTimeForChangesMapper(mockLeadTimeForChangesResMock)

    expect(mappedLeadTimeForChanges).toEqual(expectedLeadTimeForChangesValues)
  })

  it('should map time to 1 minute when mergeDelayTime is greater than 0 but less than 1', () => {
    const mockLeadTimeForChangesResMock = {
      leadTimeForChangesOfPipelines: [
        {
          name: 'fs-platform-payment-selector',
          step: 'RECORD RELEASE TO PROD',
          mergeDelayTime: 0.33,
          pipelineDelayTime: 2639.42,
          totalDelayTime: 3289.95,
        },
      ],
      avgLeadTimeForChanges: {
        name: 'Average',
        mergeDelayTime: 2341.72,
        pipelineDelayTime: 0.99,
        totalDelayTime: 2342.71,
      },
    }

    const expectedLeadTimeForChangesValues = [
      {
        id: 0,
        name: 'fs-platform-payment-selector/RECORD RELEASE TO PROD',
        valuesList: [
          { name: 'mergeDelayTime', value: '1minutes' },
          { name: 'pipelineDelayTime', value: '1day 19hours 59minutes' },
          { name: 'totalDelayTime', value: '1day 20hours 0minutes' },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          { name: 'mergeDelayTime', value: '1day 15hours 1minutes' },
          { name: 'pipelineDelayTime', value: '1minutes' },
          { name: 'totalDelayTime', value: '1day 15hours 2minutes' },
        ],
      },
    ]
    const mappedLeadTimeForChanges = leadTimeForChangesMapper(mockLeadTimeForChangesResMock)

    expect(mappedLeadTimeForChanges).toEqual(expectedLeadTimeForChangesValues)
  })

  it('should map time to 0 minute when it is 0', () => {
    const mockLeadTimeForChangesResMock = {
      leadTimeForChangesOfPipelines: [
        {
          name: 'fs-platform-payment-selector',
          step: 'RECORD RELEASE TO PROD',
          mergeDelayTime: 0,
          pipelineDelayTime: 0,
          totalDelayTime: 3289.95,
        },
      ],
      avgLeadTimeForChanges: {
        name: 'Average',
        mergeDelayTime: 0.99,
        pipelineDelayTime: 2341.72,
        totalDelayTime: 2342.71,
      },
    }

    const expectedLeadTimeForChangesValues = [
      {
        id: 0,
        name: 'fs-platform-payment-selector/RECORD RELEASE TO PROD',
        valuesList: [
          { name: 'mergeDelayTime', value: '0minutes' },
          { name: 'pipelineDelayTime', value: '0minutes' },
          { name: 'totalDelayTime', value: '0minutes' },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          { name: 'mergeDelayTime', value: '1minutes' },
          { name: 'pipelineDelayTime', value: '1day 15hours 1minutes' },
          { name: 'totalDelayTime', value: '1day 15hours 2minutes' },
        ],
      },
    ]
    const mappedLeadTimeForChanges = leadTimeForChangesMapper(mockLeadTimeForChangesResMock)

    expect(mappedLeadTimeForChanges).toEqual(expectedLeadTimeForChangesValues)
  })
})
