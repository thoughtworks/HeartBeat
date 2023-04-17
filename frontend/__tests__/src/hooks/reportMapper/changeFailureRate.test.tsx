import { changeFailureRateMapper } from '@src/hooks/reportMapper/changeFailureRate'

describe('change failure rate data mapper', () => {
  const mockChangeFailureRateRes = {
    avgChangeFailureRate: {
      name: 'Average',
      failureRate: '0.00% (0/12)',
    },
    changeFailureRateOfPipelines: [
      {
        name: 'fs-platform-onboarding',
        step: ' :shipit: deploy to PROD',
        failureRate: '0.00% (0/3)',
      },
    ],
  }
  it('maps response change failure rate values to ui display value', () => {
    const expectedChangeFailureRateValues = [
      {
        id: 0,
        name: 'fs-platform-onboarding/ :shipit: deploy to PROD',
        valuesList: [
          {
            name: 'Failure rate',
            value: '0.00% (0/3)',
          },
        ],
      },
      {
        id: 1,
        name: 'Average/',
        valuesList: [
          {
            name: 'Failure rate',
            value: '0.00% (0/12)',
          },
        ],
      },
    ]
    const mappedChangeFailureRate = changeFailureRateMapper(mockChangeFailureRateRes)

    expect(mappedChangeFailureRate).toEqual(expectedChangeFailureRateValues)
  })
})
