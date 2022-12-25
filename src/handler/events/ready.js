import { REST, Routes } from 'discord.js';
import { Event } from '../../utils/modules/handler/models/index.js';

import { Terminal } from '../../utils/services/index.js';

import * as config from '../../config/index.js';

export default class ReadyEvent extends Event {
	constructor(client) {
		super(
			{
				name: 'ready',
				once: true
			},
			client
		);
	}

	async exec() {
		Terminal.success('BOT', `Successfully logged as ${this.client.user.tag.cyan}!`);

		if (config.mode.isDeploy) {
			const rest = new REST({ version: '10' }).setToken(this.client.token);

			await rest.put(Routes.applicationCommands(this.client.user.id), {
				body: this.client.modules.handler.commands.map(command => command.slash)
			});

			Terminal.success('BOT', 'Globally registered slash commands!');
		}
	}
}
