import { exportValidityTimeMapper } from '@src/hooks/reportMapper/exportValidityTime'

describe('export validity time mapper', () => {
  it('should return 30 when call exportValidityTimeMapper given the param to 1800000', () => {
    const result = exportValidityTimeMapper(1800000)

    expect(result).toEqual(30)
  })

  it('should return undefined when call exportValidityTimeMapper given the param to undefined', () => {
    const result = exportValidityTimeMapper(null)

    expect(result).toEqual(null)
  })
})
