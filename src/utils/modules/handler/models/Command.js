import { BaseInteraction, SlashCommandBuilder } from 'discord.js';
import { DiscordBot } from '../../../../main/DiscordBot.js';

import { Terminal } from '../../../services/index.js';

export class Command {
	/**
	 * @param {Object} options - Command options.
	 * @param {String} options.name - Command name.
	 * @param {String} options.description - Command description.
	 * @param {Boolean} options.ephemeral - Whether the response should be ephemeral.
	 *
	 * @param {DiscordBot} client - The DiscordBot instance.
	 */
	constructor(options = {}, client) {
		this.client = client;

		this.name = options.name;
		this.description = options.description || '';

		this.ephemeral = options.ephemeral || false;

		this.slash = new SlashCommandBuilder().setName(this.name).setDescription(this.description);
	}

	/**
	 * @param {BaseInteraction} interaction
	 */
	async exec(interaction) {
		await interaction.deferReply();
		interaction.editReply({ content: 'Command without response!' });

		Terminal.error(
			'BOT:Commands',
			`Command ${`"${this.name}"`.yellow} is missing ${'exec'.cyan} method.`
		);
	}
}
