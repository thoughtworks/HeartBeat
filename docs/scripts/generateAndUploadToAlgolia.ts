import algoliasearch from 'algoliasearch';

// 1. Build a dataset
import { promises as fsPromises, type PathLike } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import removeMd from 'remove-markdown';

const client = algoliasearch(
	process.env.ALGOLIA_APP_ID || 'ApplicationId',
	process.env.ALGOLIA_WRITE_API_KEY || 'ALGOLIA_WRITE_API_KEY'
);

console.log(`Successfully register on algoliasearch`);

const processData = async (filenames: string[]) => {
	const result = [];
	for (const filename of filenames) {
		const markdownWithMeta = await fsPromises.readFile(filename);
		const { data: frontmatter, content } = matter(markdownWithMeta);
		const struct = {
			id: frontmatter.slug,
			title: frontmatter.title,
			content: removeMd(content).replace(/\n/g, ''),
		};
		result.push(struct);
		await upload(struct);
	}
	return result;
};

// => await filenames.map(async (filename: string) => {
//   try {
//     const markdownWithMeta = await fsPromises.readFile(filename)
//     const { data: frontmatter, content } = matter(markdownWithMeta)
//     const struct = {
//       id: frontmatter.slug,
//       title: frontmatter.title,
//       content: removeMd(content).replace(/\n/g, ""),
//     }
// 		console.log(struct)
// 		return struct
//   } catch (e) {
//     console.log(JSON.stringify(e))
//   }
// })

// 2. Send the dataset in JSON format
const upload = async (data: unknown) => {
	console.log(`Start to upload to algolia${JSON.stringify(data)}`);
	// fsPromises.writeFile('./index.json', JSON.stringify(data), )
	await client
		.initIndex('Heartbeat')
		.saveObjects([data], { autoGenerateObjectIDIfNotExist: true })
		.catch((e) => {
			console.error(JSON.stringify(e));
		});

	console.log('Successfully upload to algolia');
};

async function readFilesInDirectory(directoryPath: PathLike) {
	try {
		const files = await fsPromises.readdir(directoryPath);

		const filePaths = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(directoryPath, file);
				const stat = await fsPromises.stat(filePath);

				if (stat.isFile()) {
					return filePath;
				} else if (stat.isDirectory()) {
					const subDirectoryFiles = await readFilesInDirectory(filePath);
					return subDirectoryFiles;
				}
			})
		);

		// Flatten the array of file paths
		return filePaths.flat();
	} catch (err) {
		console.error('Error when reading file: ', err);
		throw err;
	}
}

const docsPath = './src/content/docs/en/';

console.log(`Start to read files`);
const filePaths = await readFilesInDirectory(docsPath);
console.log(`Successfully read files`);

await processData(filePaths);
