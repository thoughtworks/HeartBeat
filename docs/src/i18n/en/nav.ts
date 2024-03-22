/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 */
export default [
	{ text: 'Onboarding', header: true, type: 'tech', key: 'onboarding' },
	{ text: 'Getting Started', slug: 'getting-started', key: 'getting-started' },
	{ text: 'Glossary', slug: 'onboarding/glossary', key: 'onboarding/glossary' },
	{ text: 'Way of Working', slug: 'onboarding/way-of-working', key: 'onboarding/way-of-working' },
	{ text: 'Conventions', slug: 'onboarding/conventions', key: 'onboarding/conventions' },

	{ text: 'DevOps', header: true, type: 'tech', key: 'devops' },
	{
		text: 'How to deploy heartbeat in multiple instances by k8s',
		slug: 'devops/how-to-deploy-heartbeat-in-multiple-instances-by-k8s',
		key: 'devops/how-to-deploy-heartbeat-in-multiple-instances-by-k8s',
	},

	{ text: 'Guides', header: true, type: 'tech', key: 'guides' },
	{
		text: 'Guideline and best practices',
		slug: 'guides/guideline-and-best-practices',
		key: 'guides/guideline-and-best-practices',
	},
	{
		text: 'Start e2e test in local',
		slug: 'guides/start-e2e-test-in-local',
		key: 'guides/start-e2e-test-in-local',
	},

	{ text: 'Arch', header: true, type: 'tech', key: 'arch' },
	{ text: 'Architecture', slug: 'arch/architecture', key: 'arch/architecture' },

	{ text: 'Designs', header: true, type: 'tech', key: 'design' },
	{
		text: 'Cycle time calculation',
		slug: 'designs/cycle-time-calculation',
		key: 'designs/cycle-time-calculation',
	},
	{
		text: 'Emoji flow',
		slug: 'designs/emoji-flow',
		key: 'designs/emoji-flow',
	},
	{
		text: 'Error handle',
		slug: 'designs/error-handle',
		key: 'designs/error-handle',
	},
	{
		text: 'Export CSV',
		slug: 'designs/export-csv',
		key: 'designs/export-csv',
	},
	{
		text: 'Flow diagrams',
		slug: 'designs/flow-diagrams',
		key: 'designs/flow-diagrams',
	},
	{
		text: 'Frontend Structure',
		slug: 'designs/frontend-structure',
		key: 'designs/frontend-structure',
	},
	{
		text: 'Origin cycle time calculation',
		slug: 'designs/origin-cycle-time-calculation',
		key: 'designs/origin-cycle-time-calculation',
	},
	{
		text: 'Refinement on generate report to solve timeout issue',
		slug: 'designs/refinement-on-generate-report',
		key: 'designs/refinement-on-generate-report',
	},
	{
		text: 'Optimize generate report',
		slug: 'designs/optimize-generate-report',
		key: 'designs/optimize-generate-report',
	},
	{
		text: 'Sequence diagrams',
		slug: 'designs/sequence-diagrams',
		key: 'designs/sequence-diagrams',
	},
	{
		text: 'Support multiple columns',
		slug: 'designs/support-multiple-columns',
		key: 'designs/support-multiple-columns',
	},
	{
		text: 'E2E Testing',
		slug: 'designs/e2e-testing',
		key: 'designs/e2e-testing',
	},

	{ text: 'Issue Solutions', header: true, type: 'tech', key: 'Issue Solutions' },
	{
		text: 'Solutions of buildKite issue',
		slug: 'issue-solutions/solution-of-buildkite-issue',
		key: 'issue-solutions/solution-of-buildkite-issue',
	},

	{ text: 'Spikes', header: true, type: 'tech', key: 'spikes' },
	{
		text: 'Calculating pipeline metrics with selected user',
		slug: 'spikes/tech-spikes-calculating-pipeline-metrics-with-selected-user',
		key: 'spikes/tech-spikes-calculating-pipeline-metrics-with-selected-user',
	},
	{
		text: 'Encrypt decrypt configuration',
		slug: 'spikes/tech-spikes-encrypt-decrypt-configuration',
		key: 'spikes/tech-spikes-encrypt-decrypt-configuration',
	},
	{
		text: 'Impact of status and column name change',
		slug: 'spikes/tech-spikes-impact-of-status-and-column-name-change',
		key: 'spikes/tech-spikes-impact-of-status-and-column-name-change',
	},
	{
		text: 'Split verification of GitHub',
		slug: 'spikes/tech-spikes-split-verification-of-github',
		key: 'spikes/tech-spikes-split-verification-of-github',
	},
	{
		text: 'Split verification of buildKite',
		slug: 'spikes/tech-spikes-split-verify-of-buildkite',
		key: 'spikes/tech-spikes-split-verify-of-buildkite',
	},
	{
		text: 'Split verification of board',
		slug: 'spikes/tech-spikes-split-verification-of-board',
		key: 'spikes/tech-spikes-split-verification-of-board',
	},
	{
		text: 'Timezone problem in system',
		slug: 'spikes/tech-timezone-problem',
		key: 'spikes/tech-timezone-problem',
	},
	{
		text: 'Split multiple instances support',
		slug: 'spikes/tech-spikes-support-multiple-instances-for-backend-service',
		key: 'spikes/tech-spikes-support-multiple-instances-for-backend-service',
	},
	{
		text: 'Call jira with graphQL API',
		slug: 'spikes/tech-spikes-jira-graphql-api-about-replacing-existing-rest-api',
		key: 'spikes/tech-spikes-jira-graphql-api-about-replacing-existing-rest-api',
	},
	{
		text: 'Call buildkite with graphQL API',
		slug: 'spikes/tech-spikes-buildkite-graphql-api-about-replacing-existing-rest-api',
		key: 'spikes/tech-spikes-buildkite-graphql-api-about-replacing-existing-rest-api',
	},
	{
		text: 'Call github with graphQL API',
		slug: 'spikes/tech-spikes-github-graphql-api-about-replacing-existing-rest-api',
		key: 'spikes/tech-spikes-github-graphql-api-about-replacing-existing-rest-api',
	},
	{
		text: 'Spike the logic of calculating card rework',
		slug: 'spikes/tech-spikes-calculate-rework-of-board-card',
		key: 'spikes/tech-spikes-calculate-rework-of-board-card',
	},
	{
		text: 'Solution to optimize generate report',
		slug: 'spikes/tech-spikes-export-all-metrics-button-polling-api-backend-change',
		key: 'spikes/tech-spikes-export-all-metrics-button-polling-api-backend-change',
	},
	{
		text: 'Integrate react hook form',
		slug: 'spikes/tech-spikes-react-hook-form',
		key: 'spikes/tech-spikes-react-hook-form'
	},

	{ text: 'Biz', header: true, type: 'biz', key: 'Biz' },
	{ text: 'Biz context', slug: 'biz/business-context', key: 'biz/business-context' },

	// { text: 'Tutorials', header: true, type: 'tech', key: 'tutorials' },
	// { text: 'Build a Blog', slug: 'tutorial/0-introduction', key: 'blog-tutorial' },
	// {
	// 	text: 'Extend with Content Collections',
	// 	slug: 'tutorials/add-content-collections',
	// 	key: 'add-collections-tutorial',
	// },
	// {
	// 	text: 'Extend with View Transitions',
	// 	slug: 'tutorials/add-view-transitions',
	// 	key: 'add-transitions-tutorial',
	// },
	// // { text: 'Thinking with Islands', slug: 'tutorial/0-introduction', key: 'island-tutorial' },

	// { text: 'Basics', header: true, type: 'tech', key: 'basics' },

	// {
	// 	text: 'Project Structure',
	// 	slug: 'core-concepts/project-structure',
	// 	key: 'core-concepts/project-structure',
	// },
	// {
	// 	text: 'Components',
	// 	slug: 'core-concepts/astro-components',
	// 	key: 'core-concepts/astro-components',
	// },
	// { text: 'Pages', slug: 'core-concepts/astro-pages', key: 'core-concepts/astro-pages' },
	// { text: 'Layouts', slug: 'core-concepts/layouts', key: 'core-concepts/layouts' },
	// {
	// 	text: 'Astro Template Syntax',
	// 	slug: 'core-concepts/astro-syntax',
	// 	key: 'core-concepts/astro-syntax',
	// },
	// {
	// 	text: 'Rendering Modes',
	// 	slug: 'core-concepts/rendering-modes',
	// 	key: 'core-concepts/rendering-modes',
	// },

	// { text: 'Built-ins', header: true, type: 'tech', key: 'builtins' },
	// {
	// 	text: 'Content Collections',
	// 	slug: 'guides/content-collections',
	// 	key: 'guides/content-collections',
	// },
	// {
	// 	text: 'View Transitions',
	// 	slug: 'guides/view-transitions',
	// 	key: 'guides/view-transitions',
	// },
	// {
	// 	text: 'Prefetch',
	// 	slug: 'guides/prefetch',
	// 	key: 'guides/prefetch',
	// },

	// { text: 'Add-ons', header: true, type: 'tech', key: 'addons' },
	// { text: 'Add integrations', slug: 'guides/integrations-guide', key: 'guides/integrations-guide' },
	// {
	// 	text: 'UI Frameworks',
	// 	slug: 'core-concepts/framework-components',
	// 	key: 'core-concepts/framework-components',
	// },
	// {
	// 	text: 'SSR Adapters',
	// 	slug: 'guides/server-side-rendering',
	// 	key: 'guides/server-side-rendering',
	// },

	// { text: 'Recipes', header: true, type: 'tech', key: 'examples' },
	// { text: 'Migrate to Astro', slug: 'guides/migrate-to-astro', key: 'guides/migrate-to-astro' },
	// { text: 'Connect a CMS', slug: 'guides/cms', key: 'guides/cms' },
	// { text: 'Add backend services', slug: 'guides/backend', key: 'guides/backend' },
	// { text: 'Deploy your site', slug: 'guides/deploy', key: 'guides/deploy' },
	// { text: 'More recipes', slug: 'recipes', key: 'guides/recipes' },

	// { text: 'Guides', header: true, type: 'tech', key: 'features' },
	// { text: 'Routing', slug: 'core-concepts/routing', key: 'core-concepts/routing' },
	// { text: 'Markdown', slug: 'guides/markdown-content', key: 'guides/markdown-content' },
	// {
	// 	text: 'Scripts & Event Handling',
	// 	slug: 'guides/client-side-scripts',
	// 	key: 'guides/client-side-scripts',
	// },
	// { text: 'CSS & Styling', slug: 'guides/styling', key: 'guides/styling' },
	// { text: 'Images', slug: 'guides/images', key: 'guides/images' },
	// { text: 'Fonts', slug: 'guides/fonts', key: 'guides/fonts' },
	// { text: 'Imports', slug: 'guides/imports', key: 'guides/imports' },
	// { text: 'Endpoints', slug: 'core-concepts/endpoints', key: 'core-concepts/endpoints' },
	// { text: 'Data Fetching', slug: 'guides/data-fetching', key: 'guides/data-fetching' },
	// {
	// 	text: 'Internationalization',
	// 	slug: 'guides/internationalization',
	// 	key: 'guides/internationalization',
	// },
	// { text: 'Middleware', slug: 'guides/middleware', key: 'guides/middleware' },
	// { text: 'Testing', slug: 'guides/testing', key: 'guides/testing' },
	// { text: 'Troubleshooting', slug: 'guides/troubleshooting', key: 'guides/troubleshooting' },

	// { text: 'Configuration', header: true, type: 'tech', key: 'configuration' },
	// {
	// 	text: 'The Astro Config File',
	// 	slug: 'guides/configuring-astro',
	// 	key: 'guides/configuring-astro',
	// },
	// { text: 'TypeScript', slug: 'guides/typescript', key: 'guides/typescript' },
	// { text: 'Import Aliases', slug: 'guides/aliases', key: 'guides/aliases' },
	// {
	// 	text: 'Environment Variables',
	// 	slug: 'guides/environment-variables',
	// 	key: 'guides/environment-variables',
	// },

	// { text: 'Reference', header: true, type: 'api', key: 'reference' },
	// {
	// 	text: 'Configuration',
	// 	slug: 'reference/configuration-reference',
	// 	key: 'reference/configuration-reference',
	// },
	// { text: 'Runtime API', slug: 'reference/api-reference', key: 'reference/api-reference' },
	// {
	// 	text: 'Integrations API',
	// 	slug: 'reference/integrations-reference',
	// 	key: 'reference/integrations-reference',
	// },
	// { text: 'Adapter API', slug: 'reference/adapter-reference', key: 'reference/adapter-reference' },
	// {
	// 	text: 'Image Service API',
	// 	slug: 'reference/image-service-reference',
	// 	key: 'reference/image-service-reference',
	// },
	// {
	// 	text: 'Dev Overlay Plugin API',
	// 	slug: 'reference/dev-overlay-plugin-reference',
	// 	key: 'reference/dev-overlay-plugin-reference',
	// },
	// {
	// 	text: 'Template Directives',
	// 	slug: 'reference/directives-reference',
	// 	key: 'reference/directives-reference',
	// },
	// { text: 'The Astro CLI', slug: 'reference/cli-reference', key: 'reference/cli-reference' },
	// {
	// 	text: 'Error Reference',
	// 	slug: 'reference/error-reference',
	// 	key: 'reference/error-reference',
	// },
	// { text: 'NPM Package Format', slug: 'reference/publish-to-npm', key: 'guides/publish-to-npm' },
] as const;
