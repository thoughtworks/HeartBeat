export const SITE = {
  title: 'Heartbeat Docs',
  description: 'Your website description.',
  defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
  image: {
    src: 'https://github.com/withastro/astro/blob/main/assets/social/banner-minimal.png?raw=true',
    alt:
      'astro logo on a starry expanse of space,' + ' with a purple saturn-like planet floating in the right foreground',
  },
  twitter: 'astrodotbuild',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  dir?: 'ltr' | 'rtl';
  ogLocale?: string;
  lang?: string;
};

export const KNOWN_LANGUAGES = {
  English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/thoughtworks/HeartBeat/tree/master/docs`;

export const COMMUNITY_INVITE_URL = `https://github.com/thoughtworks/HeartBeat/issues`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: 'XXXXXXXXXX',
  appId: 'XXXXXXXXXX',
  apiKey: 'XXXXXXXXXX',
};

export type Sidebar = Record<(typeof KNOWN_LANGUAGE_CODES)[number], Record<string, { text: string; link: string }[]>>;
export const SIDEBAR: Sidebar = {
  en: {
    'User Center': [
      { text: 'Introduction', link: '/en/introduction' },
      { text: 'Page 2', link: '/en/page-2' },
      { text: 'Page 3', link: '/en/page-3' },
    ],
    'Dev Center': [
      { text: 'Team Info', link: '/en/dev-center/team-infos' },
      { text: 'Glossary', link: '/en/dev-center/glossary' },
      { text: 'Responsibilities-TL', link: '/en/dev-center/responsibilities-TL' },
      { text: 'Onboarding Flow', link: '/en/dev-center/onboarding-flow' },
      { text: 'Architecture', link: '/en/dev-center/architecture' },
      { text: 'Team Activity Calendar', link: '/en/dev-center/team-activity-calendar' },
      { text: 'Way of Working', link: '/en/dev-center/way-of-working' },
      { text: 'Business Context', link: '/en/dev-center/business-context' },
      { text: 'Tech Spikes', link: '/en/dev-center/tech-spikes' },
      { text: 'Guideline & Best Practice', link: '/en/dev-center/guideline-and-best-practices' },
      { text: 'Test Strategies', link: '/en/dev-center/test-strategies' },
      { text: 'Conventions', link: '/en/dev-center/conventions' },
      { text: 'Useful scripts & tools', link: '/en/dev-center/useful-scripts-and-tools' },
      { text: 'Report Calculation Method', link: '/en/report-calculation-method' },
      { text: 'Sequence Diagrams', link: '/en/dev-center/sequence-diagrams' },
      { text: 'Report Flow Diagrams', link: '/en/dev-center/flow-diagrams' },
      { text: 'Export CSV', link: '/en/dev-center/export-csv' },
      { text: 'Error Handle', link: '/en/dev-center/error-handle' },
      { text: 'Emoji Flow', link: '/en/dev-center/emoji-flow' },
      { text: 'CycleTime calculation', link: '/en/dev-center/cycle-time-calculation' },
      { text: 'Solution of BuildKite issue', link: '/en/dev-center/solution-of-buildkite-issue' },
      { text: 'Support multiple columns marked as done', link: '/en/dev-center/support-multiple-columns' },
    ],
  },
};
