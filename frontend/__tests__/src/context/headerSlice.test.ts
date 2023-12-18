import headerReducer, { saveVersion } from '@src/context/header/headerSlice'

describe('header reducer', () => {
  it('should get empty when handle initial state', () => {
    const header = headerReducer(undefined, { type: 'unknown' })

    expect(header.version).toEqual('')
  })

  it('should set 1.11 when handle saveVersion', () => {
    const header = headerReducer(undefined, saveVersion('1.11'))

    expect(header.version).toEqual('1.11')
  })
})
