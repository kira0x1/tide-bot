import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath, pathToFileURL } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from 'node:fs';
import path from 'node:path';
import { REST, Routes } from 'discord.js';

const GUILD_ID = process.env.GUILD_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const commands = [];

const registerGlobal = false;

const foldersPath = path.join(__dirname, '../src/commands');

async function run() {
  if (!CLIENT_ID) {
    console.error('CLIENT_ID NOT FOUND');
    return;
  }

  if (!DISCORD_TOKEN) {
    console.error('DISCORD_TOKEN NOT FOUND');
    return;
  }

  if (!GUILD_ID) {
    console.error('GUILD_ID NOT FOUND');
    return;
  }

  const commandFolders = fs
    .readdirSync(foldersPath)
    .filter((f) => !f.endsWith('.js'));

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);

    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const fileUrl = pathToFileURL(filePath);
      const { default: command } = await import(fileUrl.pathname);
      commands.push(command.data.toJSON());
    }
  }

  console.log(commands);

  const rest = new REST().setToken(DISCORD_TOKEN);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      registerGlobal
        ? Routes.applicationCommands(CLIENT_ID)
        : Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      {
        body: commands,
      }
    );

    console.log(
      // @ts-ignore
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
}

run();
