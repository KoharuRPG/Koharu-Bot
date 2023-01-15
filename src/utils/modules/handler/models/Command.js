import { BaseInteraction, AutocompleteInteraction, SlashCommandBuilder } from 'discord.js';
import { DiscordBot } from '../../../../main/DiscordBot.js';

import { Terminal } from '../../../services/index.js';

export class Command {
	/**
	 * @param {Object} options - Command options.
	 * @param {String} options.name - Command name.
	 * @param {String} options.description - Command description.
	 *
	 * @param {Boolean} options.defer - Whether the command should be deferred.
	 * @param {Boolean} options.ephemeral - If the answer must be ephemeral (need to be deferred).
	 *
	 * @param {DiscordBot} client - The DiscordBot instance.
	 */
	constructor(options = {}, client) {
		this.client = client;

		this.name = options.name;
		this.description = options.description || '';

		this.defer = !!options.defer;
		this.ephemeral = !!options.ephemeral;

		this.slash = new SlashCommandBuilder().setName(this.name).setDescription(this.description);
	}

	/**
	 * Command auto completion method.
	 * @async
	 * @public
	 *
	 * @param {AutocompleteInteraction} interaction
	 */
	async autoComplete(interaction) {
		await interaction.respond([]);
	}

	/**
	 * Command execution method.
	 * @async
	 * @public
	 *
	 * @param {BaseInteraction} interaction
	 */
	async exec(interaction) {
		if (!this.defer) await interaction.deferReply();
		await interaction.editReply({ content: 'Command without response!' });

		Terminal.error(
			'BOT:Commands',
			`Command ${`"${this.name}"`.yellow} is missing ${'exec'.cyan} method.`
		);
	}
}
