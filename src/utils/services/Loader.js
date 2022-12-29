import { readdir, lstat } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * @typedef {Object} FileData
 * @property {String} name - File name.
 * @property {String} path - File path.
 * @property {Object} content - File content.
 */

/**
 * @callback CallbackAll
 * @param {Array<FileData} files
 */

/**
 * @callback CallbackSingle
 * @param {FileData} file
 */

/**
 * Performs a read on all files in a directory.
 * @async
 *
 * @param {String} folder - Directory to be read.
 *
 * @param {Object} [options] - Read options.
 * @param {Boolean} [options.recursive] - Whether subdirectories should be read.
 * @param {Boolean} [options.import] - Whether files should be imported.
 *
 * @param {CallbackAll} [callbackAll] - Executes only once at the end of the reading.
 * @param {CallbackSingle} [callbackSingle] - Runs at the end of reading each file.
 *
 * @returns {Promise<Array<FileData>>}
 */
export const loadFolder = async (
	folder = '',
	options = {},
	callbackAll = async (_files = []) => {},
	callbackSingle = async (_file = {}) => {}
) => {
	options = Object.assign(
		{
			recursive: true,
			import: true
		},
		options
	);

	const responseFiles = [];

	const folderPath = resolve(`${folder}`);
	const folderStat = await lstat(folderPath).catch(() => false);
	if (!folderStat) {
		if (callbackAll) await callbackAll(responseFiles);
		return responseFiles;
	}

	const folderFiles = await readdir(folderPath);
	for (const file of folderFiles) {
		const filePath = resolve(`${folderPath}/${file}`);
		const fileStat = await lstat(filePath);
		if (!fileStat.isDirectory()) {
			const content = options.import
				? await import((process.platform === 'win32' ? 'file://' : '') + filePath)
				: null;
			const fileData = {
				name: file,
				path: filePath,
				content
			};

			responseFiles.push(fileData);
			if (callbackSingle) await callbackSingle(fileData);
		} else if (options.recursive) {
			await loadFolder(filePath, options, false, async recFile => {
				responseFiles.push(recFile);
				if (callbackSingle) await callbackSingle(recFile);
			});
		}
	}

	if (callbackAll) await callbackAll(responseFiles);
	return responseFiles;
};
