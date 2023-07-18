import { BuildKiteEmoji, exportToJsonFile, getEmojiNames, getEmojiUrls, removeExtraEmojiName } from '@src/utils/util'

describe('exportToJsonFile function', () => {
  test('it should create a link element with the correct attributes and click it', () => {
    const filename = 'test'
    const json = { key: 'value' }
    const documentCreateSpy = jest.spyOn(document, 'createElement')

    exportToJsonFile(filename, json)

    expect(documentCreateSpy).toHaveBeenCalledWith('a')
  })
})

describe('getEmojiName function', () => {
  test('it should get single emojis name', () => {
    const input = ':zap: one emojis'

    const expectName = ['zap']

    expect(getEmojiNames(input)).toEqual(expectName)
  })

  test('it should get multl-emojis names', () => {
    const input = ':zap: :wws: two emojis'

    const expectName = ['zap', 'wws']

    expect(getEmojiNames(input)).toEqual(expectName)
  })

  test('it should get empty names', () => {
    const input = 'no emojis '

    expect(getEmojiNames(input)).toEqual([])
  })
})

describe('getEmojiUrl function', () => {
  test('it should get empty urls', () => {
    const input = 'one emojis'
    const emojis: BuildKiteEmoji[] = [
      {
        name: 'zap',
        url: 'https://example.com/abc.png',
        aliases: [],
      },
      {
        name: 'zap1',
        url: 'https://example2.com/abc.png',
        aliases: [],
      },
    ]

    expect(getEmojiUrls(input, emojis)).toEqual([])
  })

  test('it should get single emojis url', () => {
    const input = ':zap: one emojis'
    const emojis: BuildKiteEmoji[] = [
      {
        name: 'zap',
        url: 'https://example.com/abc.png',
        aliases: [],
      },
      {
        name: 'zap1',
        url: 'https://example2.com/abc.png',
        aliases: [],
      },
    ]

    expect(getEmojiUrls(input, emojis)).toEqual(['https://example.com/abc.png'])
  })

  test('it should get muilt-emojis urls', () => {
    const input = ':zap: :www:one emojis'
    const emojis: BuildKiteEmoji[] = [
      {
        name: 'zap',
        url: 'https://example.com/abc.png',
        aliases: [],
      },
      {
        name: 'www',
        url: 'https://example2.com/abc.png',
        aliases: [],
      },
      {
        name: 'fff',
        url: 'https://example3.com/abc.png',
        aliases: [],
      },
    ]

    expect(getEmojiUrls(input, emojis)).toEqual(['https://example.com/abc.png', 'https://example2.com/abc.png'])
  })

  test('it should remove extra emojis names', () => {
    const input = ':zap: :www:one emojis'

    expect(removeExtraEmojiName(input)).toEqual(' one emojis')
  })
})
