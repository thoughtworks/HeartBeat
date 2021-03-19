import imgBuildkite from '../../../assets/img-buildkite-64.json';
import imgApple from '../../../assets/img-apple-64.json';

export default class Step {
  originStep = '';
  emoji = '';
  stepName = '';
  constructor(step: string) {
    this.originStep = step;
    if (step != null) {
      const matchedEmojis = step.match(/\:(.*?)\: |\:(.*?)\:/);
      if (matchedEmojis == null) {
        this.stepName = step;
      } else {
        const emojiName = matchedEmojis[0].replace(/\:| /g, '');
        const emojiPath =
          imgBuildkite.find((e) => e.name === emojiName || e.aliases.includes(emojiName)) ??
          imgApple.find((e) => e.name === emojiName || e.aliases.includes(emojiName));
        this.emoji = `assets/images/${emojiPath.image}`;
        const stepName = step.replace(matchedEmojis[0], '');
        this.stepName = stepName === '' ? emojiName : stepName;
      }
    }
  }
}
