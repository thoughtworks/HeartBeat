import { renderHook } from '@testing-library/react'
import { useVerifySourceControlEffect } from '@src/hooks/useVeritySourceControlEffect'

describe('use verify sourceControl state', () => {
  it('should initial data state when render hook', async () => {
    const { result } = renderHook(() => useVerifySourceControlEffect())

    expect(result.current.isLoading).toEqual(false)
  })
})
