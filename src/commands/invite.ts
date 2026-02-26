import { EmbedBuilder, Message, Client } from "discord.js";
import { PrefixCommand } from "../types";

const command: PrefixCommand = {
  name: "invite",
  description: "Get the bot's invite link.",
  category: "Utility",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    const clientId = client.user!.id;
    const inviteUrl = `https://inasha.luckydev.xyz`;

    const ownerId = "320407113887252482";

    const owner = await client.users.fetch(ownerId);

    const embed = new EmbedBuilder()
      .setTitle("Invite Me")
      .setDescription(`[Click here to invite me](${inviteUrl})`)
      .setColor(6086089)
      .setThumbnail(client.user!.displayAvatarURL({ size: 512 }))
      .setFooter({ text: `Owner: ${owner.tag}`, iconURL: owner.displayAvatarURL() })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};

export = command;