import { CleanedBuildKiteEmoji, getEmojiUrls, removeExtraEmojiName } from '@src/emojis/emoji'

describe('#emojis', () => {
  describe('#getEmojiUrls', () => {
    it('should get empty images if can not parse name from input', () => {
      const input = 'one emojis'
      const emojis: CleanedBuildKiteEmoji[] = [
        {
          image: 'abc.png',
          aliases: ['zap1'],
        },
        {
          image: 'abc.png',
          aliases: ['zap2'],
        },
      ]

      expect(getEmojiUrls(input, emojis)).toEqual([])
    })

    it('should get empty string images if can not match any emoji', () => {
      const input = ':zap: one emojis'
      const emojis: CleanedBuildKiteEmoji[] = [
        {
          image: 'abc.png',
          aliases: ['zap1'],
        },
        {
          image: 'abc.png',
          aliases: ['zap2'],
        },
      ]

      expect(getEmojiUrls(input, emojis)).toEqual([''])
    })

    it('should get single emoji image', () => {
      const input = ':zap: one emojis'
      const emojis: CleanedBuildKiteEmoji[] = [
        {
          image: 'abc.png',
          aliases: ['zap'],
        },
        {
          image: 'abc.png',
          aliases: ['zap1'],
        },
      ]

      expect(getEmojiUrls(input, emojis)).toEqual(['https://buildkiteassets.com/emojis/abc.png'])
    })

    it('should get multi-emoji images', () => {
      const input = ':zap: :www:one emojis'
      const emojis: CleanedBuildKiteEmoji[] = [
        {
          image: 'abc.png',
          aliases: ['zap'],
        },
        {
          image: 'abc.png',
          aliases: ['www'],
        },
        {
          image: 'abc.png',
          aliases: ['fff'],
        },
      ]

      expect(getEmojiUrls(input, emojis)).toEqual([
        'https://buildkiteassets.com/emojis/abc.png',
        'https://buildkiteassets.com/emojis/abc.png',
      ])
    })
  })

  describe('#removeExtraEmojiName', () => {
    it('should remove extra emojis names', () => {
      const input = ':zap: :www:one emojis'

      expect(removeExtraEmojiName(input)).toEqual(' one emojis')
    })
  })
})
