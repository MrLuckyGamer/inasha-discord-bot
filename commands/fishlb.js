const fs = require("fs");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const fishFile = "./data/fish/fish.json";

module.exports = {
  name: "fishlb",
  description: "Show the top fishers in the server!",
  category: "Fun",
  async execute(message) {
    const guildId = message.guild.id;

    const fishData = fs.existsSync(fishFile) ? JSON.parse(fs.readFileSync(fishFile)) : {};

    if (!fishData[guildId] || Object.keys(fishData[guildId]).length === 0) {
      return message.channel.send("No fish caught yet in this server! 🎣");
    }

    await message.guild.members.fetch();
    const guildMembers = message.guild.members.cache;

    const leaderboard = Object.entries(fishData[guildId])
      .map(([id, points]) => ({ id, points }))
      .filter(entry => guildMembers.has(entry.id))
      .sort((a, b) => b.points - a.points);

    const pageSize = 10;
    let currentPage = 0;
    const totalPages = Math.ceil(leaderboard.length / pageSize);

    const generateEmbed = (page) => {
      const start = page * pageSize;
      const pageEntries = leaderboard.slice(start, start + pageSize);

      const description = pageEntries
        .map((entry, index) => {
          const member = guildMembers.get(entry.id);
          return `**${start + index + 1}. ${member ? member.user.username : "Unknown"}** - ${entry.points} 🪙`;
        })
        .join("\n");

      return new EmbedBuilder()
        .setTitle(`🎣 Fish Leaderboard - ${message.guild.name}`)
        .setDescription(description || "No entries on this page.")
        .setFooter({ text: `Page ${page + 1} of ${totalPages}` })
        .setColor(0x008080)
        .setTimestamp();
    };

    const backButton = new ButtonBuilder()
      .setCustomId("back")
      .setLabel("⏮️ Back")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    const nextButton = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("⏭️ Next")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(totalPages <= 1);

    const row = new ActionRowBuilder().addComponents(backButton, nextButton);

    const messageEmbed = await message.channel.send({
      embeds: [generateEmbed(currentPage)],
      components: [row],
    });

    const collector = messageEmbed.createMessageComponentCollector({
      time: 120000, // 2 minutes
    });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: "Only the command user can use these buttons!", ephemeral: true });
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
        components: [new ActionRowBuilder().addComponents(backButton, nextButton)],
      });
    });

    collector.on("end", async () => {
      backButton.setDisabled(true);
      nextButton.setDisabled(true);

      await messageEmbed.edit({
        components: [new ActionRowBuilder().addComponents(backButton, nextButton)],
      });
    });
  },
};