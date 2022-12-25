import * as config from '../../config/index.js';

/**
 * @param {String} flag - Log flag.
 * @param {Array} content - Log content.
 */
export const log = (flag = '', content = []) => {
	return console.log(
		`${
			`${new Date().toLocaleString('pt-BR', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				timeZone: config.date.timeZone
			})} | `.green
		}${flag}`,
		...[].concat(content)
	);
};

/**
 * @param {String} flag - Log flag.
 * @param {String} description - Short description of the error.
 */
export const error = (flag = '', description = '', error = '') => {
	return log(`[${flag}]`.brightRed.bold, [`${description.toString().yellow}\n-`, error]);
};

/**
 * @param {String} flag - Log flag.
 * @param {String|Array} content - Log content.
 */
export const success = (flag = '', content = []) => {
	return log(`[${flag}]`.brightGreen.bold, content);
};
