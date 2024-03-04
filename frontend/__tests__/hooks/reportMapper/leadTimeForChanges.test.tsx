import { leadTimeForChangesMapper } from '@src/hooks/reportMapper/leadTimeForChanges';
import { PIPELINE_LEAD_TIME, PR_LEAD_TIME, TOTAL_DELAY_TIME } from '../../fixtures';

describe('lead time for changes data mapper', () => {
  const mockLeadTimeForChangesRes = {
    leadTimeForChangesOfPipelines: [
      {
        name: 'Heartbeat',
        step: ':rocket: Run e2e',
        prLeadTime: 22481.55,
        pipelineLeadTime: 4167.97,
        totalDelayTime: 18313.579999999998,
      },
    ],
    avgLeadTimeForChanges: {
      name: 'Average',
      prLeadTime: 22481.55,
      pipelineLeadTime: 4167.97,
      totalDelayTime: 18313.579999999998,
    },
  };
  it('maps response lead time for changes values to ui display value', () => {
    const expectedLeadTimeForChangesValues = [
      {
        id: 0,
        name: 'Heartbeat/:rocket: Run e2e',
        valuesList: [
          {
            name: 'PR Lead Time',
            value: '374.69',
          },
          {
            name: 'Pipeline Lead Time',
            value: '69.47',
          },
          {
            name: 'Total Lead Time',
            value: '305.23',
          },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          {
            name: 'PR Lead Time',
            value: '374.69',
          },
          {
            name: 'Pipeline Lead Time',
            value: '69.47',
          },
          {
            name: 'Total Lead Time',
            value: '305.23',
          },
        ],
      },
    ];
    const mappedLeadTimeForChanges = leadTimeForChangesMapper(mockLeadTimeForChangesRes);

    expect(mappedLeadTimeForChanges).toEqual(expectedLeadTimeForChangesValues);
  });

  it('should map time to 0 minute when it is 0', () => {
    const mockLeadTimeForChangesResMock = {
      leadTimeForChangesOfPipelines: [
        {
          name: 'fs-platform-payment-selector',
          step: 'RECORD RELEASE TO PROD',
          prLeadTime: 0,
          pipelineLeadTime: 0,
          totalDelayTime: 0,
        },
      ],
      avgLeadTimeForChanges: {
        name: 'Average',
        prLeadTime: 0,
        pipelineLeadTime: 0,
        totalDelayTime: 0,
      },
    };

    const expectedLeadTimeForChangesValues = [
      {
        id: 0,
        name: 'fs-platform-payment-selector/RECORD RELEASE TO PROD',
        valuesList: [
          { name: PR_LEAD_TIME, value: '0.00' },
          { name: PIPELINE_LEAD_TIME, value: '0.00' },
          { name: TOTAL_DELAY_TIME, value: '0.00' },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          { name: PR_LEAD_TIME, value: '0.00' },
          { name: PIPELINE_LEAD_TIME, value: '0.00' },
          { name: TOTAL_DELAY_TIME, value: '0.00' },
        ],
      },
    ];
    const mappedLeadTimeForChanges = leadTimeForChangesMapper(mockLeadTimeForChangesResMock);

    expect(mappedLeadTimeForChanges).toEqual(expectedLeadTimeForChangesValues);
  });
});
