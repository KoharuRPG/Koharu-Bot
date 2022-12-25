import { DiscordBot } from '../../../../main/DiscordBot.js';

import { Terminal } from '../../../services/index.js';

export class Event {
	/**
	 * @param {Object} options - Event options.
	 * @param {String} options.name - Event name.
	 * @param {Boolean} options.once - Whether the event should run only once.
	 *
	 * @param {DiscordBot} client - The DiscordBot instance.
	 */
	constructor(options = {}, client) {
		this.client = client;

		this.name = options.name;
		this.once = options.once || false;
	}

	exec() {
		Terminal.error(
			'BOT:Events',
			`Event ${`"${this.name}"`.yellow} is missing ${'exec'.cyan} method.`
		);
	}
}
