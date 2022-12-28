import { Database } from '../Database.js';
import { Model } from '../Model.js';

export class UsersModel extends Model {
	/**
	 * @param {Database} database - The Database instance.
	 */
	constructor(database) {
		super(database, {
			tableName: 'users'
		});
	}
}
