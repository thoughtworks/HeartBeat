import { exportToJsonFile, handleApiRequest, transformToCleanedBuildKiteEmoji } from '@src/utils/util'
import { CleanedBuildKiteEmoji, OriginBuildKiteEmoji } from '@src/emojis/emoji'

describe('exportToJsonFile function', () => {
  it('should create a link element with the correct attributes and click it', () => {
    const filename = 'test'
    const json = { key: 'value' }
    const documentCreateSpy = jest.spyOn(document, 'createElement')

    exportToJsonFile(filename, json)

    expect(documentCreateSpy).toHaveBeenCalledWith('a')
  })
})

describe('transformToCleanedBuildKiteEmoji function', () => {
  it('should transform to cleaned emoji', () => {
    const mockOriginEmoji: OriginBuildKiteEmoji = {
      name: 'zap',
      image: 'abc.com',
      aliases: [],
    }

    const expectedCleanedEmoji: CleanedBuildKiteEmoji = {
      image: 'abc.com',
      aliases: ['zap'],
    }

    const [result] = transformToCleanedBuildKiteEmoji([mockOriginEmoji])

    expect(result).toEqual(expectedCleanedEmoji)
  })
})

describe('handleApiRequest', () => {
  const mockSetIsLoading = jest.fn()
  const mockSetIsServerError = jest.fn()
  const mockSetErrorMessage = jest.fn()

  beforeEach(() => {
    mockSetIsLoading.mockReset()
    mockSetIsServerError.mockReset()
    mockSetErrorMessage.mockReset()
  })

  it('should call the apiCall function and set isLoading to true during execution', async () => {
    const mockApiCall = jest.fn().mockResolvedValue('mocked response')

    await handleApiRequest(mockApiCall, jest.fn(), mockSetIsLoading, mockSetIsServerError, mockSetErrorMessage)

    expect(mockSetIsLoading).toHaveBeenCalledTimes(2)
    expect(mockSetIsLoading).toHaveBeenCalledWith(true)
    expect(mockSetIsLoading).toHaveBeenCalledWith(false)
    expect(mockApiCall).toHaveBeenCalled()
  })

  it('should call the apiCall function and set isLoading to false on error', async () => {
    const mockApiCall = jest.fn().mockRejectedValue(new Error('Some error'))

    await handleApiRequest(mockApiCall, jest.fn(), mockSetIsLoading, mockSetIsServerError, mockSetErrorMessage)

    expect(mockSetIsLoading).toHaveBeenCalledTimes(2)
    expect(mockSetIsLoading).toHaveBeenCalledWith(true)
    expect(mockSetIsLoading).toHaveBeenCalledWith(false)
    expect(mockApiCall).toHaveBeenCalled()
  })

  it('should set isServerError to true and not set errorMessage on UNKNOWN_EXCEPTION', async () => {
    const mockApiCall = jest.fn().mockRejectedValue(new Error('Unknown'))

    await handleApiRequest(mockApiCall, jest.fn(), mockSetIsLoading, mockSetIsServerError, mockSetErrorMessage)

    expect(mockSetIsLoading).toHaveBeenCalledTimes(2)
    expect(mockSetIsLoading).toHaveBeenCalledWith(true)
    expect(mockSetIsLoading).toHaveBeenCalledWith(false)
    expect(mockApiCall).toHaveBeenCalled()
    expect(mockSetIsServerError).toHaveBeenCalledWith(true)
    expect(mockSetErrorMessage).not.toHaveBeenCalled()
  })

  it('should call the errorHandler and set errorMessage on non-UNKNOWN_EXCEPTION error', async () => {
    const mockApiCall = jest.fn().mockRejectedValue(new Error('Some error'))
    const mockErrorHandler = jest.fn()

    await handleApiRequest(mockApiCall, mockErrorHandler, mockSetIsLoading, mockSetIsServerError, mockSetErrorMessage)

    expect(mockSetIsLoading).toHaveBeenCalledTimes(2)
    expect(mockSetIsLoading).toHaveBeenCalledWith(true)
    expect(mockSetIsLoading).toHaveBeenCalledWith(false)
    expect(mockApiCall).toHaveBeenCalled()
    expect(mockErrorHandler).toHaveBeenCalledWith(expect.any(Error))
    expect(mockSetIsServerError).not.toHaveBeenCalled()
  })
})
