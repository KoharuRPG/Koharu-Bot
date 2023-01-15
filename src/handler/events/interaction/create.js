import { BaseInteraction, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';

import { Event } from '../../../utils/modules/handler/models/index.js';
import { Terminal } from '../../../utils/services/index.js';

export default class InteractionCreateEvent extends Event {
	constructor(client) {
		super(
			{
				name: 'interactionCreate'
			},
			client
		);
	}

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async chatInputCommand(interaction) {
		const command = this.client.modules.handler.commands.find(
			cmd => cmd.name === interaction.commandName
		);

		if (command) {
			if (command.defer) await interaction.deferReply({ ephemeral: command.ephemeral });

			try {
				await command.exec(interaction);
			} catch (err) {
				Terminal.error('BOT:Commands', 'Error in command execution.', err);
			}
		} else {
			await interaction.deferReply({ ephemeral: true });
			interaction.editReply({ content: 'Unknown command!' });
		}
	}

	/**
	 * @param {AutocompleteInteraction} interaction
	 */
	async autoComplete(interaction) {
		const command = this.client.modules.handler.commands.find(
			cmd => cmd.name === interaction.commandName
		);

		if (command) {
			try {
				await command.autoComplete(interaction);
			} catch (err) {
				Terminal.error('BOT:Commands', 'Error in command auto completion.', err);
			}
		} else {
			await interaction.respond([]);
		}
	}

	/**
	 * @param {BaseInteraction} interaction
	 */
	async exec(interaction) {
		if (interaction.isChatInputCommand()) return this.chatInputCommand(interaction);

		await interaction.deferReply({ ephemeral: true });
		interaction.editReply({ content: 'Interaction without response!' });
	}
}
