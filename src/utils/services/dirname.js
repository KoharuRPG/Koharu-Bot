import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Gets the path of the file.
 *
 * @param {Object} importMeta - import.meta of the file.
 *
 * @returns {String} File path.
 */
export const __dirname = importMeta => dirname(fileURLToPath(importMeta.url));
