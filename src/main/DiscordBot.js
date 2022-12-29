import Discord, { Client } from 'discord.js';

import { Database, Handler } from '../utils/modules/index.js';
import { Terminal } from '../utils/services/index.js';

export class DiscordBot extends Client {
	/**
	 * @param {Object} options - Geral discord bot options.
	 * @param {Discord.ClientOptions} client_options - Options to be sent to the discord.js Client class.
	 */
	constructor(options = {}, client_options = {}) {
		super(client_options);

		this.modules = {
			database: new Database(),
			handler: new Handler(this)
		};
	}

	/**
	 * Initialize the Discord Bot.
	 * @public
	 * @async
	 */
	async init() {
		await this.modules.database.init();

		await this.modules.handler.loadCommands();
		await this.modules.handler.loadEvents();

		this.login(process.env.TOKEN).catch(err => {
			Terminal.error('BOT', 'A Discord authentication error occurred.', err);
		});
	}
}
