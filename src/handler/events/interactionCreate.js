import { BaseInteraction, ChatInputCommandInteraction } from 'discord.js';

import { Command, Event } from '../../utils/modules/handler/models/index.js';
import { Terminal } from '../../utils/services/index.js';

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
			await interaction.deferReply({ ephemeral: command.ephemeral });

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
	 * @param {BaseInteraction} interaction
	 */
	async exec(interaction) {
		if (interaction.isChatInputCommand()) return this.chatInputCommand(interaction);

		await interaction.deferReply({ ephemeral: true });
		interaction.editReply({ content: 'Interaction without response!' });
	}
}
