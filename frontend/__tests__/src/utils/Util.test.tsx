import { exportToJsonFile, transformToCleanedBuildKiteEmoji, sortArrayWithoutEmoji } from '@src/utils/util'
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

describe('sortArrayWithoutEmoji function', () => {
  it('should sort array without emoji', () => {
    const mockOriginArray: string[] = [':cloudformation: Deploy infra', ':java: Build Backend', ':lock: Check Security']

    const expectedArray: string[] = [':java: Build Backend', ':lock: Check Security', ':cloudformation: Deploy infra']

    const result = sortArrayWithoutEmoji(mockOriginArray)

    expect(result).toEqual(expectedArray)
  })

  it('should return a empty array if array is empty', () => {
    const mockOriginArray: string[] = []

    const expectedArray: string[] = []

    const result = sortArrayWithoutEmoji(mockOriginArray)

    expect(result).toEqual(expectedArray)
  })
})
