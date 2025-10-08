const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const kissGifs = [
  "https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif",
  "https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.gif",
  "https://media.giphy.com/media/bGm9FuBCGg4SY/giphy.gif",
  "https://media.giphy.com/media/nyGFcsP0kAobm/giphy.gif",
  "https://media.giphy.com/media/ZRSGWtBJG4Tza/giphy.gif",
  "https://media.giphy.com/media/KH1CTZtw1iP3W/giphy.gif",
  "https://media.giphy.com/media/hnNyVPIXgLdle/giphy.gif",
  "https://media.giphy.com/media/wOtkVwroA6yzK/giphy.gif"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("Send a kiss to someone!")
    .addUserOption(option =>
      option.setName("target")
        .setDescription("Who do you want to kiss?")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("target");
    const gif = kissGifs[Math.floor(Math.random() * kissGifs.length)];

    const embed = new EmbedBuilder()
      .setColor(8388736)
      .setTitle(`${interaction.user.username} kissed ${user.username}! 😘`)
      .setImage(gif)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};