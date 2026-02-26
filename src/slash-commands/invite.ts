import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Client } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get the bot's invite link."),

  async execute(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
    const clientId = client.user!.id;
    const inviteUrl = `https://inasha.luckydev.xyz`;

    const ownerId = "320407113887252482";
    const owner = await client.users.fetch(ownerId);

    const embed = new EmbedBuilder()
      .setTitle("Invite Me")
      .setDescription(`[Click here to invite me](${inviteUrl})`)
      .setColor(6086089)
      .setThumbnail(client.user!.displayAvatarURL({ size: 512 }))
      .setFooter({
        text: `Owner: ${owner.tag}`,
        iconURL: owner.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  },
};

export = command;