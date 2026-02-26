import { Message, Client, PermissionFlagsBits, TextChannel } from "discord.js";
import { PrefixCommand } from "../types";

const command: PrefixCommand = {
  name: "purge",
  description: "Delete a number of messages from the channel.",
  category: "Moderation",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) {
      await message.reply("You don't have permission to manage messages.");
      return;
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0 || amount > 100) {
      await message.reply("Please enter a number between **1 and 100**.");
      return;
    }

    try {
      const channel = message.channel as TextChannel;
      await channel.bulkDelete(amount, true);
      const msg = await message.channel.send(`Deleted **${amount}** messages.`);
      setTimeout(() => msg.delete().catch(() => {}), 3000);
    } catch (err) {
      console.error(err);
      await message.reply("Could not delete messages.");
    }
  },
};

export = command;