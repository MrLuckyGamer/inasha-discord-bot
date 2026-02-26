import { PermissionFlagsBits, Message, Client, TextChannel } from "discord.js";
import { PrefixCommand } from "../types";

const command: PrefixCommand = {
  name: "unlock",
  description: "Unlock the current channel.",
  category: "Moderation",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await message.reply("You need **Manage Channels** permission.");
      return;
    }

    if (!message.guild) {
      await message.reply("This command can only be used in a server.");
      return;
    }

    const channel = message.channel as TextChannel;
    await channel.permissionOverwrites.edit(message.guild.id, {
      ViewChannel: true,
    });

    await message.reply("Channel unlocked!");
  },
};

export = command;