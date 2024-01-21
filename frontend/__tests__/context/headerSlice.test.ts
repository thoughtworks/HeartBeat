import headerReducer, { saveVersion } from '@src/context/header/headerSlice';
import { VERSION_RESPONSE } from '../fixtures';

describe('header reducer', () => {
  it('should get empty when handle initial state', () => {
    const header = headerReducer(undefined, { type: 'unknown' });

    expect(header.version).toEqual('');
  });

  it('should set 1.11 when handle saveVersion', () => {
    const header = headerReducer(undefined, saveVersion(VERSION_RESPONSE.version));

    expect(header.version).toEqual(VERSION_RESPONSE.version);
  });
});
