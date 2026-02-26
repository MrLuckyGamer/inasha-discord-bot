import { Message, Client, PermissionFlagsBits } from "discord.js";
import { PrefixCommand } from "../types";

const command: PrefixCommand = {
  name: "kick",
  description: "Kick a user from the server.",
  category: "Moderation",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    if (!message.member?.permissions.has(PermissionFlagsBits.KickMembers)) {
      await message.reply("You don't have permission to kick members.");
      return;
    }

    const user = message.mentions.members?.first();
    if (!user) {
      await message.reply("You must mention a user to kick.");
      return;
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      await user.kick(reason);
      await message.channel.send(`Kicked **${user.user.tag}** | Reason: *${reason}*`);
    } catch (err) {
      console.error(err);
      await message.reply("I was unable to kick that user.");
    }
  },
};

export = command;