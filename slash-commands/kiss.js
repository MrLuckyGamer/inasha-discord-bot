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
    .setDescription("Send a kiss to someone")
    .setDMPermission(true)
    .addUserOption(option =>
      option.setName("target")
        .setDescription("Who do you want to kiss?")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const gif = kissGifs[Math.floor(Math.random() * kissGifs.length)];
    const target = interaction.options.getUser("target");

    let title;

    if (!interaction.guild) {
      title = `💌 ${interaction.user.username} sends a kiss into your DMs! 😘`;
    } else if (target) {
      title = `${interaction.user.username} kissed ${target.username}! 😘`;
    } else {
      title = `${interaction.user.username} blows a kiss to everyone! 💋`;
    }

    const embed = new EmbedBuilder()
      .setColor(0xff66aa)
      .setTitle(title)
      .setImage(gif)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};