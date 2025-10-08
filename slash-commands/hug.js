const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const hugGifs = [
  "https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif",
  "https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif",
  "https://media.giphy.com/media/wnsgren9NtITS/giphy.gif",
  "https://media.giphy.com/media/143v0Z4767T15e/giphy.gif",
  "https://media.giphy.com/media/sUIZWMnfd4Mb6/giphy.gif",
  "https://media.giphy.com/media/xT39CXg70nNS0MFNLy/giphy.gif",
  "https://media.giphy.com/media/BXrwTdoho6hkQ/giphy.gif",
  "https://media.giphy.com/media/lrr9rHuoJOE0w/giphy.gif",
  "https://media.giphy.com/media/8tpiC1JAYVMFq/giphy.gif"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Send a hug to someone!")
    .addUserOption(option => 
      option.setName("target")
        .setDescription("Who do you want to hug?")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("target");
    const gif = hugGifs[Math.floor(Math.random() * hugGifs.length)];

    const embed = new EmbedBuilder()
      .setColor(8388736)
      .setTitle(`${interaction.user.username} hugged ${user.username}! 🤗`)
      .setImage(gif)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};