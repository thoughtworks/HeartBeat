import { velocityMapper } from '@src/mapper/VelocityMapper'

describe('velocity data mapper', () => {
  it('maps response velocity values to ui display value', () => {
    const mockVelocityRes = {
      velocityForSP: '20',
      velocityForCards: '15',
    }
    const expectedVelocityValues = [
      { id: 1, name: 'Velocity(SP)', value: ['20'] },
      { id: 2, name: 'ThroughPut(Cards Count)', value: ['15'] },
    ]

    const mappedVelocityValues = velocityMapper(mockVelocityRes)

    expect(mappedVelocityValues).toEqual(expectedVelocityValues)
  })
})
