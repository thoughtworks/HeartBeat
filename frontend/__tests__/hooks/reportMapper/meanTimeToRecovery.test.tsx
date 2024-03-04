import { meanTimeToRecoveryMapper } from '@src/hooks/reportMapper/meanTimeToRecovery';

describe('mean time to recovery data mapper', () => {
  const mockMeanTimeToRecovery = {
    avgMeanTimeToRecovery: {
      name: 'Average',
      timeToRecovery: 162120031.8,
    },
    meanTimeRecoveryPipelines: [
      {
        name: 'fs-platform-onboarding',
        step: ' :shipit: deploy to PROD',
        timeToRecovery: 162120031.8,
      },
    ],
  };
  it('maps response change failure rate values to ui display value', () => {
    const expectedMeanTimeToRecovery = [
      {
        id: 0,
        name: 'fs-platform-onboarding/ :shipit: deploy to PROD',
        valuesList: [
          {
            name: 'Mean Time To Recovery',
            value: '45.03',
          },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          {
            name: 'Mean Time To Recovery',
            value: '45.03',
          },
        ],
      },
    ];
    const mappedMeanTimeToRecovery = meanTimeToRecoveryMapper(mockMeanTimeToRecovery);

    expect(mappedMeanTimeToRecovery).toEqual(expectedMeanTimeToRecovery);
  });

  it('should format time when timeToRecovery is greater than 0 but less than 1', () => {
    const mockMeanTimeToRecovery = {
      avgMeanTimeToRecovery: {
        name: 'Average',
        timeToRecovery: 0.32,
      },
      meanTimeRecoveryPipelines: [
        {
          name: 'fs-platform-onboarding',
          step: ' :shipit: deploy to PROD',
          timeToRecovery: 0.32,
        },
      ],
    };
    const expectedMeanTimeToRecovery = [
      {
        id: 0,
        name: 'fs-platform-onboarding/ :shipit: deploy to PROD',
        valuesList: [
          {
            name: 'Mean Time To Recovery',
            value: '0.00',
          },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          {
            name: 'Mean Time To Recovery',
            value: '0.00',
          },
        ],
      },
    ];
    const mappedMeanTimeToRecovery = meanTimeToRecoveryMapper(mockMeanTimeToRecovery);

    expect(mappedMeanTimeToRecovery).toEqual(expectedMeanTimeToRecovery);
  });

  it('should map time to 0 minute when it is 0', () => {
    const mockMeanTimeToRecovery = {
      avgMeanTimeToRecovery: {
        name: 'Average',
        timeToRecovery: 0,
      },
      meanTimeRecoveryPipelines: [
        {
          name: 'fs-platform-onboarding',
          step: ' :shipit: deploy to PROD',
          timeToRecovery: 0,
        },
      ],
    };
    const expectedMeanTimeToRecovery = [
      {
        id: 0,
        name: 'fs-platform-onboarding/ :shipit: deploy to PROD',
        valuesList: [
          {
            name: 'Mean Time To Recovery',
            value: '0.00',
          },
        ],
      },
      {
        id: 1,
        name: 'Average',
        valuesList: [
          {
            name: 'Mean Time To Recovery',
            value: '0.00',
          },
        ],
      },
    ];
    const mappedMeanTimeToRecovery = meanTimeToRecoveryMapper(mockMeanTimeToRecovery);

    expect(mappedMeanTimeToRecovery).toEqual(expectedMeanTimeToRecovery);
  });
});
