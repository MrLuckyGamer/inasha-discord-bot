import { EmbedBuilder, ChannelType, Message, Client } from "discord.js";
import { PrefixCommand } from "../types";

const command: PrefixCommand = {
  name: "serverinfo",
  description: "Show server information.",
  category: "Utility",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    const guild = message.guild;
    if (!guild) {
      await message.reply("This command can only be used in a server.");
      return;
    }

    const humanCount = guild.members.cache.filter(m => !m.user.bot).size;

    const totalChannels = guild.channels.cache.filter(ch =>
      ch.type === ChannelType.GuildText || ch.type === ChannelType.GuildVoice
    ).size;

    const embed = new EmbedBuilder()
      .setTitle(`Server Info: ${guild.name}`)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "Members", value: `${humanCount}`, inline: true },
        { name: "Channels", value: `${totalChannels}`, inline: true },
        { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
        { name: "Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true },
        { name: "Created On", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true }
      )
      .setColor(6086089)
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};

export = command;