import { leadTimeForChangesMapper } from '@src/hooks/reportMapper/leadTimeForChanges'
import { PIPELINE_LEAD_TIME, PR_LEAD_TIME, TOTAL_DELAY_TIME } from '../../fixtures'

describe('lead time for changes data mapper', () => {
  const mockLeadTimeForChangesRes = {
    leadTimeForChangesOfPipelines: [
      {
        name: 'fs-platform-payment-selector',
        step: 'RECORD RELEASE TO PROD',
        prLeadTime: 2702.53,
        pipelineLeadTime: 2587.42,
        totalDelayTime: 5289.95,
      },
    ],
    avgLeadTimeForChanges: {
      name: 'Average',
      prLeadTime: 3647.51,
      pipelineLeadTime: 2341.72,
      totalDelayTime: 5989.22,
    },
  }
  it('maps response lead time for changes values to ui display value', () => {
    const expectedLeadTimeForChangesValues = [
      {
        id: 0,
        name: 'fs-platform-payment-selector/RECORD RELEASE TO PROD',
        valuesList: [
          { name: PR_LEAD_TIME, value: '1day 21hours 2minutes' },
          { name: PIPELINE_LEAD_TIME, value: '1day 19hours 7minutes' },
          { name: TOTAL_DELAY_TIME, value: '3day 16hours 9minutes' },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          { name: PR_LEAD_TIME, value: '2day 12hours 47minutes' },
          { name: PIPELINE_LEAD_TIME, value: '1day 15hours 1minutes' },
          { name: TOTAL_DELAY_TIME, value: '4day 3hours 49minutes' },
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
          prLeadTime: 2639.42,
          pipelineLeadTime: 0.49,
          totalDelayTime: 3289.95,
        },
      ],
      avgLeadTimeForChanges: {
        name: 'Average',
        prLeadTime: 2341.72,
        pipelineLeadTime: 0.99,
        totalDelayTime: 2342.71,
      },
    }

    const expectedLeadTimeForChangesValues = [
      {
        id: 0,
        name: 'fs-platform-payment-selector/RECORD RELEASE TO PROD',
        valuesList: [
          { name: PR_LEAD_TIME, value: '1day 19hours 59minutes' },
          { name: PIPELINE_LEAD_TIME, value: '1minutes' },
          { name: TOTAL_DELAY_TIME, value: '1day 20hours 0minutes' },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          { name: PR_LEAD_TIME, value: '1day 15hours 1minutes' },
          { name: PIPELINE_LEAD_TIME, value: '1minutes' },
          { name: TOTAL_DELAY_TIME, value: '1day 15hours 2minutes' },
        ],
      },
    ]
    const mappedLeadTimeForChanges = leadTimeForChangesMapper(mockLeadTimeForChangesResMock)

    expect(mappedLeadTimeForChanges).toEqual(expectedLeadTimeForChangesValues)
  })

  it('should map time to 1 minute when prLeadTime is greater than 0 but less than 1', () => {
    const mockLeadTimeForChangesResMock = {
      leadTimeForChangesOfPipelines: [
        {
          name: 'fs-platform-payment-selector',
          step: 'RECORD RELEASE TO PROD',
          prLeadTime: 0.33,
          pipelineLeadTime: 2639.42,
          totalDelayTime: 3289.95,
        },
      ],
      avgLeadTimeForChanges: {
        name: 'Average',
        prLeadTime: 2341.72,
        pipelineLeadTime: 0.99,
        totalDelayTime: 2342.71,
      },
    }

    const expectedLeadTimeForChangesValues = [
      {
        id: 0,
        name: 'fs-platform-payment-selector/RECORD RELEASE TO PROD',
        valuesList: [
          { name: PR_LEAD_TIME, value: '1minutes' },
          { name: PIPELINE_LEAD_TIME, value: '1day 19hours 59minutes' },
          { name: TOTAL_DELAY_TIME, value: '1day 20hours 0minutes' },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          { name: PR_LEAD_TIME, value: '1day 15hours 1minutes' },
          { name: PIPELINE_LEAD_TIME, value: '1minutes' },
          { name: TOTAL_DELAY_TIME, value: '1day 15hours 2minutes' },
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
          prLeadTime: 0,
          pipelineLeadTime: 0,
          totalDelayTime: 3289.95,
        },
      ],
      avgLeadTimeForChanges: {
        name: 'Average',
        prLeadTime: 0.99,
        pipelineLeadTime: 2341.72,
        totalDelayTime: 2342.71,
      },
    }

    const expectedLeadTimeForChangesValues = [
      {
        id: 0,
        name: 'fs-platform-payment-selector/RECORD RELEASE TO PROD',
        valuesList: [
          { name: PR_LEAD_TIME, value: '0minutes' },
          { name: PIPELINE_LEAD_TIME, value: '0minutes' },
          { name: TOTAL_DELAY_TIME, value: '0minutes' },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          { name: PR_LEAD_TIME, value: '1minutes' },
          { name: PIPELINE_LEAD_TIME, value: '1day 15hours 1minutes' },
          { name: TOTAL_DELAY_TIME, value: '1day 15hours 2minutes' },
        ],
      },
    ]
    const mappedLeadTimeForChanges = leadTimeForChangesMapper(mockLeadTimeForChangesResMock)

    expect(mappedLeadTimeForChanges).toEqual(expectedLeadTimeForChangesValues)
  })
})
