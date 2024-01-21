import { velocityMapper } from '@src/hooks/reportMapper/velocity';

describe('velocity data mapper', () => {
  it('maps response velocity values to ui display value', () => {
    const mockVelocityRes = {
      velocityForSP: 20,
      velocityForCards: 15,
    };
    const expectedVelocityValues = [
      { id: 0, name: 'Velocity(Story Point)', valueList: [{ value: 20 }] },
      { id: 1, name: 'Throughput(Cards Count)', valueList: [{ value: 15 }] },
    ];

    const mappedVelocityValues = velocityMapper(mockVelocityRes);

    expect(mappedVelocityValues).toEqual(expectedVelocityValues);
  });
});
