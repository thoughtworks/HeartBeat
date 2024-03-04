import dedent from 'dedent-js';
import glob from 'fast-glob';
import fs from 'fs';
import { escape } from 'html-escaper';
import { minimatch } from 'minimatch';
import os from 'os';
import path from 'path';
import simpleGit, { type DefaultLogFields, type ListLogLine } from 'simple-git';
import { fileURLToPath } from 'url';
import type { DocSearchTranslation, UIDict } from '~/i18n/translation-checkers';
import docsearchTranslations from '../../../src/i18n/en/docsearch';
import navTranslations from '../../../src/i18n/en/nav';
import uiTranslations from '../../../src/i18n/en/ui';
import { githubGet } from '../../lib/github-get.mjs';
import output from '../../lib/output.mjs';
import type {
	OldTranslationIndex,
	PageData,
	PageIndex,
	PageTranslationStatus,
} from '../../lib/translation-status/types';
import { toUtcString, tryGetFrontMatterBlock } from '../../lib/translation-status/utils.js';

type NestedRecord = { [k: string]: string | NestedRecord };

export const COMMIT_IGNORE = /(en-only|typo|broken link|i18nReady|i18nIgnore)/i;
export const TRACKER_DIRECTIVE = /@tracker-major:.*/i;

interface PullRequest {
	html_url: string;
	title: string;
	labels: {
		name: string;
	}[];
}

/**
 * Uses the git commit history to build an HTML-based overview of
 * the current Astro Docs translation status.
 *
 * This code is designed to be run on every push to the `main` branch.
 */
export class TranslationStatusBuilder {
	constructor(config: {
		pageSourceDir: string;
		oldTranslationDir: string;
		/**
		 * Full path & file name of the HTML file that the translation status should be written to.
		 * If the parent path does not exist yet, it will be created.
		 * */
		htmlOutputFilePath: string;
		sourceLanguage: string;
		targetLanguages: string[];
		languageLabels: { [key: string]: string };
		githubRepo: string;
		githubToken?: string;
	}) {
		this.pageSourceDir = config.pageSourceDir;
		this.oldTranslationDir = config.oldTranslationDir;
		this.htmlOutputFilePath = path.resolve(config.htmlOutputFilePath);
		this.sourceLanguage = config.sourceLanguage;
		this.targetLanguages = config.targetLanguages;
		this.languageLabels = config.languageLabels;
		this.githubRepo = config.githubRepo;
		this.githubToken = config.githubToken;
		this.git = simpleGit({
			maxConcurrentProcesses: Math.max(2, Math.min(32, os.cpus().length)),
		});
	}

	readonly pageSourceDir;
	readonly oldTranslationDir;
	readonly htmlOutputFilePath;
	readonly sourceLanguage;
	readonly targetLanguages;
	readonly languageLabels;
	readonly githubRepo;
	readonly githubToken;
	readonly git;

	async run() {
		// Before we start, validate that this is not a shallow clone of the repo
		const isShallowRepo = await this.git.revparse(['--is-shallow-repository']);
		if (isShallowRepo !== 'false') {
			output.error(dedent`This script cannot operate on a shallow clone of the git repository.
				Please add the checkout setting "fetch-depth: 0" to your GitHub workflow:
				- name: Checkout
				  uses: actions/checkout@v3
				  with:
				    fetch-depth: 0
			`);
			process.exit(1);
		}

		output.debug(`*** Building translation status`);

		// Ensure that the output directory exists before continuing
		output.debug(`- Output file path: ${this.htmlOutputFilePath}`);
		const outputDir = path.dirname(this.htmlOutputFilePath);
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Create an index of all Markdown/MDX pages grouped by language,
		// with information about the last minor & major commit per page
		output.debug(`- Generating page index...`);
		const pages = await this.createPageIndex();
		const oldTranslations = await this.createOldTranslationIndex();

		// Determine translation status by source page
		const statusByPage = this.getTranslationStatusByPage(pages, oldTranslations);

		// Append translation status by UI source page
		statusByPage.unshift(...(await this.getUITranslationsIndex()));

		// Fetch all pull requests
		const pullRequests = await this.getPullRequests();

		// Render a human-friendly summary
		output.debug(`- Building HTML file...`);
		const html = this.renderHtmlStatusPage(statusByPage, pullRequests);

		// Write HTML output to file
		fs.writeFileSync(this.htmlOutputFilePath, html);

		output.debug('');
		output.debug('*** Success!');
		output.debug('');
	}

	/**
	 * Check two objects for key equality
	 */
	equalKeys(obj1: NestedRecord, obj2: NestedRecord) {
		function inner(obj: NestedRecord) {
			const result: string[] = [];
			function rec(obj: NestedRecord, c: string) {
				Object.keys(obj).forEach(function (e) {
					if (typeof obj[e] == 'object') rec(obj[e] as NestedRecord, c + e);
					result.push(c + e);
				});
			}
			rec(obj, '');
			return result;
		}
		const keys1 = inner(obj1),
			keys2 = inner(obj2);
		return keys2.every((e) => keys1.includes(e));
	}

	/**
	 * Get status of UI translations
	 */
	async getUITranslationsIndex(): Promise<PageTranslationStatus[]> {
		const getPageUrl = ({
			lang,
			page,
			type = 'blob',
			refName = 'main',
			query = '',
		}: {
			lang: string;
			page: string;
			query?: string;
			type?: string;
			refName?: string;
		}) => {
			return (
				`https://github.com/${this.githubRepo}/${type}/${refName}` +
				`/src/i18n/${lang}/${page}.ts${query}`
			);
		};

		const pages: [string, DocSearchTranslation | typeof navTranslations | UIDict][] = [
			['docsearch', docsearchTranslations],
			['nav', navTranslations],
			['ui', uiTranslations],
		];

		return Promise.all(
			pages.map(async ([page, enTranslation]): Promise<PageTranslationStatus> => {
				const subpath = `src/i18n/en/${page}.ts`;
				const en = await this.getGitHistory(subpath);
				const translations: PageTranslationStatus['translations'] = {};

				for (const lang of this.targetLanguages) {
					const subpath = `src/i18n/${lang}/${page}.ts`;
					const module = (await import(`../../../${subpath}`)).default;

					// @ts-expect-error enTranslation.length is defined in one case
					const isIncomplete = enTranslation.length
						? module.filter((k: { labelIsTranslated: boolean }) => k.labelIsTranslated).length !==
						  (enTranslation as typeof navTranslations).length
						: !this.equalKeys(module, enTranslation as NestedRecord);

					const data = await this.getGitHistory(subpath);
					translations[lang] = {
						githubUrl: getPageUrl({ lang, page }),
						isMissing: !data,
						isOutdated: isIncomplete || (data && data.lastMajorCommitDate < en.lastMajorCommitDate),
						hasOldTranslation: false, // We don't have old translations for UI strings
						page: {
							lastChange: data.lastCommitDate,
							lastCommitMsg: data.lastCommitMessage,
							lastMajorChange: data.lastMajorCommitDate,
							lastMajorCommitMsg: data.lastMajorCommitMessage,
						},
						sourceHistoryUrl: isIncomplete
							? undefined
							: getPageUrl({
									lang: 'en',
									page,
									type: 'commits',
									query: data ? `?since=${data.lastMajorCommitDate}` : '',
							  }),
					};
				}

				return {
					githubUrl: getPageUrl({ lang: 'en', page }),
					subpath: `${page}.ts`,
					sourcePage: {
						lastChange: en.lastCommitDate,
						lastCommitMsg: en.lastCommitMessage,
						lastMajorChange: en.lastMajorCommitDate,
						lastMajorCommitMsg: en.lastMajorCommitMessage,
					},
					translations,
				};
			})
		);
	}

	/** Get all pull requests with the `i18n` tag */
	async getPullRequests() {
		const pullRequests: PullRequest[] = await githubGet({
			url: `https://api.github.com/repos/${this.githubRepo}/pulls?state=open&per_page=100`,
			githubToken: this.githubToken,
		});

		return pullRequests.filter((pr) => pr.labels.find((label) => label.name === 'i18n'));
	}

	async createPageIndex(): Promise<PageIndex> {
		// Initialize a new page index with a stable key order
		const pages: PageIndex = {
			[this.sourceLanguage]: {},
		};
		this.targetLanguages.forEach((lang) => (pages[lang] = {}));

		// Enumerate all markdown pages with supported languages in pageSourceDir,
		// retrieve their page data and update them
		const pagePaths = await glob(`**/*.{md,mdx}`, {
			cwd: this.pageSourceDir,
		});
		const updatedPages = await Promise.all(
			pagePaths.sort().map(async (pagePath) => {
				const pathParts = pagePath.split('/');
				if (pathParts.length < 2) return;
				const lang = pathParts[0];
				const subpath = pathParts.splice(1).join('/');

				// Ignore pages with languages not contained in our configuration
				if (!pages[lang]) return;

				// Create or update page data for the page
				return {
					lang,
					subpath,
					pageData: await this.getSinglePageData(pagePath),
				};
			})
		);

		// Write the updated pages to the index
		updatedPages.forEach((page) => {
			if (!page) return;
			const { lang, subpath, pageData } = page;
			pages[lang][subpath] = pageData;
		});

		return pages;
	}

	async createOldTranslationIndex(): Promise<OldTranslationIndex> {
		// Initialize a new old translation index with a stable key order
		// A stable key order is not strictly necessary here as we are writing
		// output based the output of `createPageIndex` which already has a stable key order.
		const oldTranslations: OldTranslationIndex = {
			[this.sourceLanguage]: [],
		};
		this.targetLanguages.forEach((lang) => (oldTranslations[lang] = []));

		// Enumerate all markdown pages with supported languages in oldTranslationDir
		// then split the path into language and subpath and add it to the index
		const pagePaths = await glob(`**/*.{md,mdx}`, {
			cwd: this.oldTranslationDir,
		});
		pagePaths.forEach((pagePath) => {
			const pathParts = pagePath.split('/');
			if (pathParts.length < 2) return;
			const lang = pathParts[0];
			const subpath = pathParts.splice(1).join('/');

			// Ignore pages with languages not contained in our configuration
			if (!oldTranslations[lang]) return;

			// Add page to the index
			oldTranslations[lang].push(subpath);
		});

		return oldTranslations;
	}

	/**
	 * Processes the markdown page located in the pageSourceDir subpath `pagePath`
	 * and creates a new page data object based on its frontmatter and git history.
	 */
	async getSinglePageData(pagePath: string): Promise<PageData> {
		const fullFilePath = `${this.pageSourceDir}/${pagePath}`;

		// Retrieve git history for the current page
		const gitHistory = await this.getGitHistory(fullFilePath);

		// Retrieve i18nReady flag from frontmatter
		const frontMatterBlock = tryGetFrontMatterBlock(fullFilePath);
		const i18nReady = /^\s*i18nReady:\s*true\s*$/m.test(frontMatterBlock);

		return {
			...(i18nReady ? { i18nReady: true } : {}),
			lastChange: gitHistory.lastCommitDate,
			lastCommitMsg: gitHistory.lastCommitMessage,
			lastMajorChange: gitHistory.lastMajorCommitDate,
			lastMajorCommitMsg: gitHistory.lastMajorCommitMessage,
		};
	}

	async getGitHistory(filePath: string) {
		const gitLog = await this.git.log({
			file: filePath,
			strictDate: true,
		});

		const lastCommit = gitLog.latest;
		if (!lastCommit) {
			throw new Error(dedent`Failed to retrieve last commit information for file
				"${filePath}". Your working copy should not contain uncommitted new pages
				when running this script.`);
		}

		// Attempt to find the last "major" commit, ignoring any commits that
		// usually do not require translations to be updated
		const lastMajorCommit =
			gitLog.all.find((logEntry) => {
				return this.isValidMajor(logEntry, filePath);
			}) || lastCommit;

		return {
			lastCommitMessage: lastCommit.message,
			lastCommitDate: toUtcString(lastCommit.date),
			lastMajorCommitMessage: lastMajorCommit.message,
			lastMajorCommitDate: toUtcString(lastMajorCommit.date),
		};
	}

	/* 	
		Determines if a commit is a valid major. Any commits that include one of the 
		keywords from `COMMIT_IGNORE` have all their files marked as minor changes.
		Meanwhile, the `@tracker-major` directive if used in a final squash commit's
		description, selects specific files to be marked as major changes.

		Example usage:
		@tracker-major:./src/content/docs/en/concepts/mpa-vs-spa.mdx;./src/content/docs/en/concepts/why-astro.mdx

		Pages changed:
		`en/mpa-vs-spa.mdx`, `en/why-astro.mdx`, `pt-br/markdown-content.mdx`

		Only `en/mpa-vs-spa.mdx` & `en/why-astro.mdx` are marked as major; translations 
		to these pages all become outdated and other pages from the commit stay the same. 
		Also works when there's no English pages! The translated files will be marked as 
		updated, but the same pages from other languages won't be affected by it, keeping
		their old state.

		You can also use glob matching!

		Example usage:
		@tracker-major:./src/content/docs/en/core-concepts/+(astro-components|astro-pages).mdx

		Pages changed:
		`en/astro-components.mdx`, `en/astro-pages.mdx`, `en/astro-syntax.mdx`

		Will mark only `en/astro-components.mdx` & `en/astro-pages.mdx` as major changes.

		See minimatch docs for examples on glob patterns:
		https://github.com/isaacs/minimatch/blob/main/README.md
		
	*/
	isValidMajor(entry: DefaultLogFields & ListLogLine, filePath: string) {
		const trackerDirectiveMatch = entry.body.match(TRACKER_DIRECTIVE);

		if (entry.message.match(COMMIT_IGNORE)) return false;
		if (!trackerDirectiveMatch) return true;

		const globsOrPaths = trackerDirectiveMatch[0].replace('@tracker-major:', '').split(';');

		return globsOrPaths.find((globOrPath) => minimatch(filePath, globOrPath)) ? true : false;
	}

	getTranslationStatusByPage(
		pages: PageIndex,
		oldTranslations: OldTranslationIndex
	): PageTranslationStatus[] {
		const sourcePages = pages[this.sourceLanguage];
		const arrContent: PageTranslationStatus[] = [];

		Object.keys(sourcePages).forEach((subpath) => {
			const sourcePage = sourcePages[subpath];
			if (!sourcePage.i18nReady) return;

			const content: PageTranslationStatus = {
				subpath,
				sourcePage,
				githubUrl: this.getPageUrl({ lang: this.sourceLanguage, subpath }),
				translations: {},
			};

			this.targetLanguages.forEach((lang) => {
				const i18nPage = pages[lang][subpath];
				content.translations[lang] = {
					page: i18nPage,
					isMissing: !i18nPage,
					isOutdated: i18nPage && sourcePage.lastMajorChange > i18nPage.lastMajorChange,
					hasOldTranslation: oldTranslations[lang].includes(subpath),
					githubUrl: this.getPageUrl({ lang, subpath }),
					sourceHistoryUrl: this.getPageUrl({
						lang: 'en',
						subpath,
						type: 'commits',
						query: i18nPage ? `?since=${i18nPage.lastMajorChange}` : '',
					}),
				};
			});

			arrContent.push(content);
		});

		return arrContent;
	}

	getPageUrl({
		type = 'blob',
		refName = 'main',
		lang,
		subpath,
		query = '',
	}: {
		type?: string;
		refName?: string;
		lang: string;
		subpath: string;
		query?: string;
	}) {
		const noDotSrcDir = this.pageSourceDir.replace(/^.\//, '');
		return (
			`https://github.com/${this.githubRepo}/${type}/${refName}` +
			`/${noDotSrcDir}/${lang}/${subpath}${query}`
		);
	}

	/**
	 * Renders the primary HTML output of this script by loading a template from disk,
	 * rendering the individual views to HTML, and inserting them into the template.
	 */
	renderHtmlStatusPage(statusByPage: PageTranslationStatus[], prs: PullRequest[]) {
		// Load HTML template
		const templateFilePath = path.join(
			path.dirname(fileURLToPath(import.meta.url)),
			'template.html'
		);
		const html = fs.readFileSync(templateFilePath, { encoding: 'utf8' });

		// Replace placeholders in the template with the rendered views
		// and return the resulting HTML page
		return html
			.replace(
				'<!-- TranslationStatusByLanguage -->',
				this.renderTranslationStatusByLanguage(statusByPage)
			)
			.replace('<!-- TranslationNeedsReview -->', this.renderTranslationNeedsReview(prs))
			.replace(
				'<!-- TranslationStatusByPage -->',
				this.renderTranslationStatusByPage(statusByPage)
			);
	}

	renderTranslationStatusByLanguage(statusByPage: PageTranslationStatus[]) {
		const lines: string[] = [];

		this.targetLanguages.forEach((lang) => {
			const missing = statusByPage.filter((content) => content.translations[lang].isMissing);
			const outdated = statusByPage.filter((content) => content.translations[lang].isOutdated);
			lines.push('<details>');
			lines.push(
				`<summary><strong>` +
					`${this.languageLabels[lang]} (${lang})` +
					`</strong><br>` +
					`<span class="progress-summary">` +
					`${statusByPage.length - outdated.length - missing.length} done, ` +
					`${outdated.length} need${outdated.length === 1 ? 's' : ''} updating, ` +
					`${missing.length} missing` +
					`</span>` +
					'<br>' +
					this.renderProgressBar(statusByPage.length, outdated.length, missing.length) +
					`</summary>`
			);
			lines.push(``);
			if (outdated.length > 0) {
				lines.push(`<h5>🔄&nbsp; Needs updating</h5>`);
				lines.push(`<ul>`);
				lines.push(
					...outdated.map(
						(content) =>
							`<li>` +
							`${this.renderLink(content.githubUrl, content.subpath)} ` +
							(content.translations[lang].sourceHistoryUrl
								? `(${this.renderLink(
										content.translations[lang].githubUrl,
										'outdated translation'
								  )}, ${this.renderLink(
										content.translations[lang].sourceHistoryUrl!,
										'source change history'
								  )})`
								: `(${this.renderLink(
										content.translations[lang].githubUrl,
										'incomplete translation'
								  )})`) +
							`</li>`
					)
				);
				lines.push(`</ul>`);
			}
			if (missing.length > 0) {
				lines.push(`<h5>❌&nbsp; Missing</h5>`);
				lines.push(`<ul>`);
				lines.push(
					...missing.map(
						(content) =>
							`<li>` +
							`${this.renderLink(content.githubUrl, content.subpath)} &nbsp; ` +
							(content.translations[lang].hasOldTranslation
								? `${this.renderLink(
										`https://github.com/${this.githubRepo}/blob/main/old-translations/${lang}/${content.subpath}`,
										`View\xa0old\xa0translation`,
										'create-button'
								  )} &nbsp; `
								: '') +
							this.renderCreatePageButton(lang, content.subpath) +
							`</li>`
					)
				);
				lines.push(`</ul>`);
			}
			lines.push(`</details>`);
			lines.push(``);
		});

		return lines.join('\n');
	}

	renderTranslationNeedsReview(prs: PullRequest[]) {
		const lines: string[] = [];

		if (prs.length > 0) {
			lines.push(`<ul>`);
			lines.push(
				...prs.map((pr) => {
					const title = pr.title.replaceAll('`', '');
					return `<li>` + this.renderLink(pr.html_url, title) + `</li>`;
				})
			);
			lines.push(`</ul>`);
		}
		lines.push(``);

		return lines.join('\n');
	}

	renderTranslationStatusByPage(statusByPage: PageTranslationStatus[]) {
		const lines: string[] = [];

		lines.push('<table role="table" class="status-by-page">');

		lines.push('<thead><tr>');
		lines.push(['Page', ...this.targetLanguages].map((col) => `<th>${col}</th>`).join(''));
		lines.push('</tr></thead>');

		lines.push('<tbody>');
		const spacer = `<tr class="spacer">\n${this.targetLanguages
			.map(() => `<td></td>`)
			.join('\n')}\n</tr>`;
		lines.push(spacer);
		statusByPage.forEach((content) => {
			const cols = [];
			cols.push(this.renderLink(content.githubUrl, content.subpath));
			cols.push(
				...this.targetLanguages.map((lang) => {
					const translation = content.translations[lang];
					if (translation.isMissing)
						return `<span title="${lang}: Missing"><span aria-hidden="true">❌</span></span>`;
					if (translation.isOutdated)
						return `<a href="${translation.githubUrl}" title="${lang}: Needs updating"><span aria-hidden="true">🔄</span></a>`;
					return `<a href="${translation.githubUrl}" title="${lang}: Completed"><span aria-hidden="true">✔</span></a>`;
				})
			);
			lines.push(`<tr>\n${cols.map((col) => `<td>${col}</td>`).join('\n')}\n</tr>`);
		});
		lines.push(spacer);
		lines.push('</tbody>');

		lines.push('</table>');

		lines.push(`\n<sup>❌ Missing &nbsp; 🔄 Needs updating &nbsp; ✔ Completed</sup>`);

		return lines.join('\n');
	}

	/**
	 * Render a link to a pre-filled GitHub UI for creating a new file.
	 *
	 * @param lang Language tag to create page for
	 * @param filename Subpath of page to create
	 */
	renderCreatePageButton(lang: string, filename: string): string {
		// We include `lang` twice because GitHub eats the last path segment when setting filename.
		const createUrl = new URL(`https://github.com/${this.githubRepo}/new/main/src/content/docs`);
		createUrl.searchParams.set('filename', lang + '/' + filename);
		createUrl.searchParams.set('value', '---\ntitle:\ndescription:\n---\n');
		return this.renderLink(createUrl.href, `Create\xa0page\xa0+`, 'create-button');
	}

	/**
	 * Render a progress bar with emoji.
	 */
	renderProgressBar(
		total: number,
		outdated: number,
		missing: number,
		{ size = 20 }: { size?: number } = {}
	) {
		const outdatedLength = Math.round((outdated / total) * size);
		const missingLength = Math.round((missing / total) * size);
		const doneLength = size - outdatedLength - missingLength;
		return (
			'<span class="progress-bar" aria-hidden="true">' +
			[
				[doneLength, '🟪'],
				[outdatedLength, '🟧'],
				[missingLength, '⬜'],
			]
				.map(([length, icon]) => Array(length).fill(icon))
				.flat()
				.join('') +
			'</span>'
		);
	}

	renderLink(href: string, text: string, className = ''): string {
		return `<a href="${escape(href)}" class="${escape(className)}">${escape(text)}</a>`;
	}
}
