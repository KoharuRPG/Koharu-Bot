import { DiscordBot } from '../../../main/DiscordBot.js';
import { Command, Event } from './models/index.js';

import { __dirname as dirname, Loader, Terminal } from '../../services/index.js';

const __dirname = dirname(import.meta);

export class Handler {
	/**
	 * @param {DiscordBot} client - The DiscordBot instance.
	 */
	constructor(client) {
		this.client = client;

		/**
		 * @type {Array<Command>}
		 */
		this.commands = [];

		/**
		 * @type {Array<Event>}
		 */
		this.events = [];
	}

	async loadCommands() {
		const files = await Loader.loadFolder(`${__dirname}/../../../handler/commands/`);

		this.commands = files.map(file => new file.content.default(this.client));

		Terminal.success(
			'BOT:Handler',
			`${this.commands.length.toString().yellow} commands have been loaded.`
		);
	}

	async loadEvents() {
		const files = await Loader.loadFolder(`${__dirname}/../../../handler/events/`);

		for (const file of files) {
			const event = new file.content.default(this.client);
			this.events.push(event);

			this.client[event.once ? 'once' : 'on'](event.name, function () {
				event.exec(...arguments);
			});
		}

		Terminal.success(
			'BOT:Handler',
			`${this.events.length.toString().yellow} events have been loaded.`
		);
	}
}
