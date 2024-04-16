import { devMeanTimeToRecoveryMapper } from '@src/hooks/reportMapper/devMeanTimeToRecovery';

describe('dev mean time to recovery data mapper', () => {
  const mockDevMeanTimeToRecovery = {
    avgDevMeanTimeToRecovery: {
      name: 'Average',
      timeToRecovery: 162120031.8,
    },
    devMeanTimeToRecoveryOfPipelines: [
      {
        name: 'fs-platform-onboarding',
        step: ' :shipit: deploy to PROD',
        timeToRecovery: 162120031.8,
      },
    ],
  };
  it('maps response dev change failure rate values to ui display value', () => {
    const expectedDevMeanTimeToRecovery = [
      {
        id: 0,
        name: 'fs-platform-onboarding/ :shipit: deploy to PROD',
        valueList: [
          {
            value: '45.03',
          },
        ],
      },
    ];
    const mappedDevMeanTimeToRecovery = devMeanTimeToRecoveryMapper(mockDevMeanTimeToRecovery);

    expect(mappedDevMeanTimeToRecovery).toEqual(expectedDevMeanTimeToRecovery);
  });

  it('should format time when timeToRecovery is greater than 0 but less than 1', () => {
    const mockDevMeanTimeToRecovery = {
      avgDevMeanTimeToRecovery: {
        name: 'Average',
        timeToRecovery: 0.32,
      },
      devMeanTimeToRecoveryOfPipelines: [
        {
          name: 'fs-platform-onboarding',
          step: ' :shipit: deploy to PROD',
          timeToRecovery: 0.32,
        },
      ],
    };
    const expectedDevMeanTimeToRecovery = [
      {
        id: 0,
        name: 'fs-platform-onboarding/ :shipit: deploy to PROD',
        valueList: [
          {
            value: '0.00',
          },
        ],
      },
    ];
    const mappedDevMeanTimeToRecovery = devMeanTimeToRecoveryMapper(mockDevMeanTimeToRecovery);

    expect(mappedDevMeanTimeToRecovery).toEqual(expectedDevMeanTimeToRecovery);
  });

  it('should map time to 0 minute when it is 0', () => {
    const mockDevMeanTimeToRecovery = {
      avgDevMeanTimeToRecovery: {
        name: 'Average',
        timeToRecovery: 0,
      },
      devMeanTimeToRecoveryOfPipelines: [
        {
          name: 'fs-platform-onboarding',
          step: ' :shipit: deploy to PROD',
          timeToRecovery: 0,
        },
      ],
    };
    const expectedDevMeanTimeToRecovery = [
      {
        id: 0,
        name: 'fs-platform-onboarding/ :shipit: deploy to PROD',
        valueList: [
          {
            value: '0.00',
          },
        ],
      },
    ];
    const mappedDevMeanTimeToRecovery = devMeanTimeToRecoveryMapper(mockDevMeanTimeToRecovery);

    expect(mappedDevMeanTimeToRecovery).toEqual(expectedDevMeanTimeToRecovery);
  });
});
