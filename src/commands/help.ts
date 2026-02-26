import { EmbedBuilder, Message, Client } from "discord.js";
import { PrefixCommand, ExtendedClient } from "../types";

const prefix = process.env.prefix || "i>";

const command: PrefixCommand = {
  name: "help",
  description: "Show all commands grouped by category.",
  category: "Utility",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    const extClient = client as ExtendedClient;

    const categories: Record<string, string[]> = {};
    extClient.commands.forEach(cmd => {
      const category = cmd.category || "Uncategorized";
      if (!categories[category]) categories[category] = [];
      categories[category].push(`\`${prefix}${cmd.name}\` - ${cmd.description}`);
    });

    const embed = new EmbedBuilder()
      .setTitle("Help: List of Commands")
      .setColor(6086089)
      .setTimestamp();

    for (const [category, cmds] of Object.entries(categories)) {
      embed.addFields({ name: category, value: cmds.join("\n") });
    }

    await message.channel.send({ embeds: [embed] });
  },
};

export = command;