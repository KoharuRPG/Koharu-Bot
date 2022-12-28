import pg from 'pg';
import { Database } from './Database.js';

export class Model {
	/**
	 * @param {Database} database - The Database instance.
	 *
	 * @param {Object} options - Table model options.
	 * @param {String} options.tableName - Table name.
	 */
	constructor(database, options = {}) {
		this.database = database;

		this.tableName = options?.tableName;

		this._conditions = ['AND', 'OR'];
	}

	/**
	 * @typedef {Object.<string, Object>|Array<Object.<string, Object>|'AND'|'OR'>} WhereArgs
	 */

	/**
	 * @typedef {Array<String>|String} Selectors
	 */

	/**
	 * Formats query selectors.
	 * @public
	 *
	 * @param {Selectors} selectors - Columns that must be returned
	 *
	 * @returns {String}
	 */
	formatSelectors(selectors = ['*']) {
		return []
			.concat(selectors)
			.map(selector => (selector === '*' ? '*' : selector))
			.join(', ');
	}

	/**
	 * Format the query where.
	 * @public
	 *
	 * @param {WhereArgs} where_args - Search arguments.
	 * @param {Number} starts_in - Position at which to start counting arguments.
	 */
	formatWhere(where_args = [], starts_in = 0) {
		where_args = [].concat(where_args);

		let query = [];

		let numArgs = starts_in;
		const args = [];

		for (const arg of where_args) {
			if (this._conditions.includes(arg.toUpperCase?.())) {
				query.push(arg.toUpperCase());
				continue;
			}

			const resEntries = [];
			let numEntries = 0;

			for (const argData of Object.entries(arg)) {
				numEntries++;

				if (numEntries > 1) resEntries.push('AND');
				resEntries.push(`${argData[0]}=$${++numArgs}`);
				args.push(argData[1]);
			}

			if (query.length > 0 && !this._conditions.includes(query.slice(-1)[0]))
				query.push('AND');
			query.push(resEntries);
		}

		query = query.flat();

		return {
			query: query[0] ? `WHERE ${query.join(' ')}` : '',
			args: args,
			lastArg: numArgs
		};
	}

	/**
	 * Format columns and values from a SET of a query.
	 * @public
	 *
	 * @param {Object<string, Object} data - Columns and values.
	 * @param {Number} starts_in - Position at which to start counting arguments.
	 */
	formatSet(data, starts_in = 0) {
		let numArgs = starts_in;
		const args = [];
		const query = [];

		for (const dataEntrie of Object.entries(data)) {
			query.push(`${dataEntrie[0]}=$${++numArgs}`);
			args.push(dataEntrie[1]);
		}

		return {
			query: query[0] ? `SET ${query.join(', ')}` : '',
			args: args,
			lastArg: numArgs
		};
	}

	/**
	 * Format columns and values from a VALUES of a query.
	 * @public
	 *
	 * @param {Object<string, Object} data - Columns and values.
	 * @param {Number} starts_in - Position at which to start counting arguments.
	 */
	formatValues(data, starts_in = 0) {
		let numArgs = starts_in;

		const dataEntries = Object.entries(data);
		const columns = dataEntries.map(dataEntrie => dataEntrie[0]);
		const values = dataEntries.map(dataEntrie => dataEntrie[1]);

		return {
			query: `(${columns.join(', ')}) VALUES (${values
				.map((_, valueI) => `$${numArgs + valueI + 1}`)
				.join(', ')})`,
			args: values,
			lastArg: numArgs + dataEntries.length
		};
	}

	/**
	 * Perform a row search on the database.
	 * @public
	 * @async
	 *
	 * @param {WhereArgs} where - Search arguments.
	 * @param {Selectors} selectors - Columns that must be returned
	 *
	 * @returns {Promise<pg.QueryResultRow>}
	 */
	async find(where = [], selectors = ['*']) {
		const whereData = this.formatWhere(where);

		const query = `SELECT ${this.formatSelectors(selectors)} FROM ${this.tableName} ${
			whereData.query
		}`;

		const queryResponse = await this.database.query(query, whereData.args);

		return queryResponse?.rows || [];
	}

	/**
	 * Searches for a single row in the database.
	 * @public
	 * @async
	 *
	 * @param {WhereArgs} where - Search arguments.
	 * @param {Selectors} selectors - Columns that must be returned
	 *
	 * @returns {Promise<pg.QueryResultRow>}
	 */
	async findOne(where = [], selectors = ['*']) {
		const whereData = this.formatWhere(where);

		const queryResponse = await this.database.query(
			`SELECT ${this.formatSelectors(selectors)} FROM ${this.tableName} ${
				whereData.query
			} LIMIT 1`,
			whereData.args
		);

		return queryResponse?.rows?.[0] || false;
	}

	/**
	 * Insert a row into the database.
	 * @public
	 * @async
	 *
	 * @param {Object<string, Object>|Array<Object<string, Object>>} data - Data to be inserted.
	 *
	 * @returns
	 */
	async insert(data = {}) {
		const valuesData = this.formatValues(data);

		const queryResponse = await this.database.query(
			`INSERT INTO ${this.tableName} ${valuesData.query}`,
			valuesData.args
		);

		return queryResponse?.rowCount || 0;
	}

	/**
	 * Update a row in the database.
	 * @public
	 * @async
	 *
	 * @param {WhereArgs} where - Search arguments.
	 * @param {Object<string, Object>} data - Data to be updated.
	 *
	 * @returns {Promise<Number>}
	 */
	async update(where = [], data = {}) {
		const setData = this.formatSet(data);
		const whereData = this.formatWhere(where, setData.lastArg);

		const queryResponse = await this.database.query(
			`UPDATE ${this.tableName} ${setData.query} ${whereData.query}`,
			[...setData.args, ...whereData.args]
		);

		return queryResponse?.rowCount || 0;
	}

	/**
	 * Delete a row in the database.
	 * @public
	 * @async
	 *
	 * @param {WhereArgs} where - Search arguments.
	 *
	 * @returns {Promise<Number>}
	 */
	async delete(where = []) {
		const whereData = this.formatWhere(where);

		const queryResponse = await this.database.query(
			`DELETE FROM ${this.tableName} ${whereData.query}`,
			whereData.args
		);

		return queryResponse?.rowCount || 0;
	}
}
