import { transformToCleanedBuildKiteEmoji } from '@src/utils/util';
import buildKiteEmojis from '@src/assets/buildkiteEmojis.json';
import appleEmojis from '@src/assets/appleEmojis.json';

export interface OriginBuildKiteEmoji {
  name: string;
  image: string;
  aliases: string[];
}

export interface CleanedBuildKiteEmoji {
  image: string;
  aliases: string[];
}

const EMOJI_URL_PREFIX = 'https://buildkiteassets.com/emojis/';

const DEFAULT_EMOJI = 'img-buildkite-64/buildkite.png';

const cleanedEmojis: CleanedBuildKiteEmoji[] = (() =>
  transformToCleanedBuildKiteEmoji([...buildKiteEmojis, ...appleEmojis]))();

const getEmojiNames = (input: string): string[] => {
  const regex = /:([\w+-]+):/g;
  const matches = input.match(regex) || [];
  return matches.map((match) => match.replaceAll(':', ''));
};

export const getEmojiUrls = (pipelineStepName: string): string[] => {
  const emojiNames = getEmojiNames(pipelineStepName);
  return emojiNames.flatMap((name) => {
    const emojiImage: string | undefined = cleanedEmojis.find(({ aliases }) => aliases.includes(name))?.image;
    return emojiImage ? `${EMOJI_URL_PREFIX}${emojiImage}` : `${EMOJI_URL_PREFIX}${DEFAULT_EMOJI}`;
  });
};

export const removeExtraEmojiName = (pipelineStepName: string): string => {
  const emojiNames = getEmojiNames(pipelineStepName);
  emojiNames.map((name) => {
    pipelineStepName = pipelineStepName.replaceAll(name, '');
  });
  return pipelineStepName.replaceAll(':', '');
};
