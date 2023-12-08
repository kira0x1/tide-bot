import { Collection } from 'discord.js';
import { Client } from 'discord.js';
import commands from './commands/index.js';

class Tide extends Client {
  /**
   * @typedef {{data: import("discord.js").SlashCommandBuilder, execute(interaction: import("discord.js").CommandInteraction): void | Promise<void>}} Command
   *
   * @memberof Tide
   * @type {Collection<string, Command>}
   */
  commands = new Collection();

  /**
   * @param {import("discord.js").ClientOptions} options
   */
  constructor(options) {
    super(options);

    for (const { 0: _, 1: subCommands } of Object.entries(commands)) {
      for (const cmd of subCommands) {
        this.commands.set(cmd.data.name, cmd);
      }
    }

    this.on('interactionCreate', this.interactionCreate);
  }

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  async interactionCreate(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = this.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Command not found: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  }
}

export default Tide;
