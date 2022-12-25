import pg from 'pg';

import { Terminal } from '../../services/index.js';

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
	}

	/**
	 * Test the connection to the database.
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
}
