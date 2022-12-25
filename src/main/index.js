import { GatewayIntentBits } from 'discord.js';
import { DiscordBot } from './DiscordBot.js';

import dotenv from 'dotenv';
import 'colors';

import * as config from '../config/index.js';

dotenv.config({
	path: config.mode.isDev ? '.env.dev' : '.env'
});

const bot = new DiscordBot(
	{},
	{
		intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
	}
);

bot.init();
