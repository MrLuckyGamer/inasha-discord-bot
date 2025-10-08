const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const slapGifs = [
  "https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif",
  "https://media.giphy.com/media/mEtSQlxqBtWWA/giphy.gif",
  "https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif",
  "https://media.giphy.com/media/Zau0yrl17uzdK/giphy.gif",
  "https://media.giphy.com/media/3XlEk2RxPS1m8/giphy.gif",
  "https://media.giphy.com/media/RXGNsyRb1hDJm/giphy.gif"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap someone playfully!")
    .addUserOption(option =>
      option.setName("target")
        .setDescription("Who do you want to slap?")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("target");
    const gif = slapGifs[Math.floor(Math.random() * slapGifs.length)];

    const embed = new EmbedBuilder()
      .setColor(8388736)
      .setTitle(`${interaction.user.username} slapped ${user.username}! 👋`)
      .setImage(gif)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};