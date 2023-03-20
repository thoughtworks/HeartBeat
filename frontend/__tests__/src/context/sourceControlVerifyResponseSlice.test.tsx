import sourceControlVerifyResponseReducer, {
  updateSourceControlVerifyResponse,
} from '@src/context/config/sourceControl/sourceControlVerifyResponse/sourceControlVerifyResponseSlice'

describe('sourceControlVerifyResponse reducer', () => {
  it('should show empty array when handle initial state', () => {
    const sourceControlVerifyResponse = sourceControlVerifyResponseReducer(undefined, { type: 'unknown' })

    expect(sourceControlVerifyResponse.sourceControl).toEqual([])
  })

  it('should store sourceControl data when get network sourceControl verify response', () => {
    const mockSourceControlVerifyResponse = {
      sourceControl: [],
    }

    const sourceControlResponse = sourceControlVerifyResponseReducer(
      { sourceControl: [] },
      updateSourceControlVerifyResponse({ sourceControl: mockSourceControlVerifyResponse.sourceControl })
    )

    expect(sourceControlResponse.sourceControl).toEqual(mockSourceControlVerifyResponse.sourceControl)
  })
})
