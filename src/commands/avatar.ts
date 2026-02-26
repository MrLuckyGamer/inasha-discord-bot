import { EmbedBuilder, Message, Client } from "discord.js";
import { PrefixCommand } from "../types";

const command: PrefixCommand = {
  name: "avatar",
  description: "Show the avatar of yourself or another user.",
  category: "Utility",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    let user = message.mentions.users.first();

    if (!user && args.length > 0 && message.guild) {
      const name = args.join(" ").toLowerCase();
      user = message.guild.members.cache.find(
        m => m.user.username.toLowerCase().includes(name)
      )?.user;
    }

    if (!user) {
      user = message.author;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ size: 1024 }))
      .setColor(6086089)
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};

export = command;