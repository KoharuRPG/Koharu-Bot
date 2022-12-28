import pg from 'pg';

import { Terminal } from '../../services/index.js';
import * as models from './models/index.js';

export class Database extends pg.Pool {
	constructor() {
		super({
			host: process.env.PG_HOST,
			port: process.env.PG_PORT,
			user: process.env.PG_USER,
			password: process.env.PG_PASS,
			database: process.env.PG_DATA,
			max: 10,
			connectionTimeoutMillis: 10000,
			idleTimeoutMillis: 25000
		});

		this.Users = new models.Users(this);
	}

	/**
	 * Test the connection to the database.
	 * @public
	 * @async
	 */
	async init() {
		try {
			const client = await this.connect();
			client.release(true);

			Terminal.success(
				'PostgreSQL',
				`Successfully connected to the ${process.env.PG_DATA.cyan} database.`
			);
		} catch (err) {
			Terminal.error('PostgreSQL', 'An error occurred while trying to connect.', err);
		}
	}

	/**
	 * Insert a row into the database.
	 * @public
	 * @async
	 *
	 * @param {String} query - Query that will be executed.
	 * @param {Array} args - Query arguments.
	 *
	 * @returns {Promise<pg.QueryResult>}
	 */
	async query(query = '', args = []) {
		const queryResponse = await super.query(query, args).catch(err => {
			Terminal.error(
				'PostgreSQL',
				`An error occurred while performing a query.\n- ${query}`,
				err
			);

			return false;
		});

		return queryResponse;
	}
}
