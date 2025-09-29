const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Show the avatar of yourself or another user.",
  category: "Utility",
  async execute(message, args) {
    let user = message.mentions.users.first();

    if (!user && args.length > 0) {
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
      .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setColor(8388736)
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};