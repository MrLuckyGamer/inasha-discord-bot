import { Message, Client, PermissionFlagsBits } from "discord.js";
import { PrefixCommand } from "../types";

const command: PrefixCommand = {
  name: "ban",
  description: "Ban a user from the server.",
  category: "Moderation",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers)) {
      await message.reply("You don't have permission to ban members.");
      return;
    }

    const user = message.mentions.members?.first();
    if (!user) {
      await message.reply("You must mention a user to ban.");
      return;
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      await user.ban({ reason });
      await message.channel.send(`Banned **${user.user.tag}** | Reason: *${reason}*`);
    } catch (err) {
      console.error(err);
      await message.reply("I was unable to ban that user.");
    }
  },
};

export = command;