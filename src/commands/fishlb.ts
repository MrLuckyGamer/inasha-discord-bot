import fs from "fs";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, Client, ComponentType } from "discord.js";
import { PrefixCommand, FishData } from "../types";

const fishFile = "./data/fish/fish.json";

const command: PrefixCommand = {
  name: "fishlb",
  description: "Show the top fishers in the server!",
  category: "Fun",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    if (!message.guild) {
      await message.reply("This command can only be used in a server.");
      return;
    }

    const guildId = message.guild.id;

    const fishData: FishData = fs.existsSync(fishFile) 
      ? JSON.parse(fs.readFileSync(fishFile, "utf8")) 
      : {};

    if (!fishData[guildId] || Object.keys(fishData[guildId]).length === 0) {
      await message.channel.send("No fish caught yet in this server! 🎣");
      return;
    }

    await message.guild.members.fetch();
    const guildMembers = message.guild.members.cache;

    const leaderboard = Object.entries(fishData[guildId])
      .map(([id, points]) => ({ id, points: points as number }))
      .filter(entry => guildMembers.has(entry.id))
      .sort((a, b) => b.points - a.points);

    const pageSize = 10;
    let currentPage = 0;
    const totalPages = Math.ceil(leaderboard.length / pageSize);

    const generateEmbed = (page: number) => {
      const start = page * pageSize;
      const pageEntries = leaderboard.slice(start, start + pageSize);

      const description = pageEntries
        .map((entry, index) => {
          const member = guildMembers.get(entry.id);
          return `**${start + index + 1}. ${member ? member.user.username : "Unknown"}** - ${entry.points}`;
        })
        .join("\n");

      return new EmbedBuilder()
        .setTitle(`🎣 Fish Leaderboard - ${message.guild!.name}`)
        .setDescription(description || "No entries on this page.")
        .setFooter({ text: `Page ${page + 1} of ${totalPages}` })
        .setColor(6086089)
        .setTimestamp();
    };

    const backButton = new ButtonBuilder()
      .setCustomId("back")
      .setLabel("⏮️ Back")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    const nextButton = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("Next ⏭️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(totalPages <= 1);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(backButton, nextButton);

    const messageEmbed = await message.channel.send({
      embeds: [generateEmbed(currentPage)],
      components: [row],
    });

    const collector = messageEmbed.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120000, // 2 minutes
    });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== message.author.id) {
        await interaction.reply({ content: "Only the command user can use these buttons!", ephemeral: true });
        return;
      }

      if (interaction.customId === "back" && currentPage > 0) {
        currentPage--;
      } else if (interaction.customId === "next" && currentPage < totalPages - 1) {
        currentPage++;
      }

      backButton.setDisabled(currentPage === 0);
      nextButton.setDisabled(currentPage === totalPages - 1);

      await interaction.update({
        embeds: [generateEmbed(currentPage)],
        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(backButton, nextButton)],
      });
    });

    collector.on("end", async () => {
      backButton.setDisabled(true);
      nextButton.setDisabled(true);

      await messageEmbed.edit({
        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(backButton, nextButton)],
      }).catch(() => {});
    });
  },
};

export = command;