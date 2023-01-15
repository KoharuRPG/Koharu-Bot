import { ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../utils/modules/handler/models/index.js';

export default class PingCommand extends Command {
	constructor() {
		super({
			name: 'ping',
			description: 'Respond with Pong!',
			defer: true,
			ephemeral: true
		});
	}

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async exec(interaction) {
		interaction.editReply({ content: 'Pong! ;)' });
	}
}
