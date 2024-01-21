import { getEmojiUrls, removeExtraEmojiName } from '@src/constants/emojis/emoji';

jest.mock('@src/utils/util', () => ({
  transformToCleanedBuildKiteEmoji: jest.fn().mockReturnValue([
    { image: 'abc1.png', aliases: ['zap1'] },
    { image: 'abc2.png', aliases: ['zap2'] },
  ]),
}));

describe('#emojis', () => {
  describe('#getEmojiUrls', () => {
    const EMOJI_URL_PREFIX = 'https://buildkiteassets.com/emojis/';
    it('should get empty images when can not parse name from input', () => {
      const mockPipelineStepName = 'one emojis';

      expect(getEmojiUrls(mockPipelineStepName)).toEqual([]);
    });

    it('should get default image url when can not match any emoji', () => {
      const mockPipelineStepName = ':zap: one emojis';

      expect(getEmojiUrls(mockPipelineStepName)).toEqual([`${EMOJI_URL_PREFIX}img-buildkite-64/buildkite.png`]);
    });

    it('should get single emoji image', () => {
      const mockPipelineStepName = ':zap1: one emojis';

      expect(getEmojiUrls(mockPipelineStepName)).toEqual([`${EMOJI_URL_PREFIX}abc1.png`]);
    });

    it('should get multi-emoji images', () => {
      const input = ':zap1: :zap2:one emojis';

      expect(getEmojiUrls(input)).toEqual([`${EMOJI_URL_PREFIX}abc1.png`, `${EMOJI_URL_PREFIX}abc2.png`]);
    });
  });

  describe('#removeExtraEmojiName', () => {
    it('should remove extra emojis names', () => {
      const input = ':zap: :www:one emojis';

      expect(removeExtraEmojiName(input)).toEqual(' one emojis');
    });
  });
});
