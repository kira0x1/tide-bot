import clc from 'cli-color';
import { GatewayIntentBits } from 'discord.js';
import Tide from './bot.js';
import config from './config.js';

const client = new Tide({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', (readyClient) => {
  console.log(clc.bgBlue.bold(`Logged in as ${readyClient.user.username}`));
});

client.login(config.DISCORD_TOKEN);
