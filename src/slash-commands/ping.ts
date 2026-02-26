import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
    await interaction.reply("Pong! 🏓");
  },
};

export = command;