const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "warn",
  description: "Warn a user with a reason in the channel.",
  category: "Moderation",
  usage: "<@user> <reason>",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply("You need **Kick Members** permission to warn users.");
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply("Please mention a user to warn.");

    const reason = args.slice(1).join(" ");
    if (!reason) return message.reply("Please provide a reason for the warning.");

    const warnEmbed = new EmbedBuilder()
      .setTitle("⚠️ User Warned")
      .setColor("Orange")
      .addFields(
        { name: "User", value: `${member.user.tag}`, inline: true },
        { name: "Warned By", value: `${message.author.tag}`, inline: true },
        { name: "Reason", value: reason }
      )
      .setTimestamp();

    message.channel.send({ embeds: [warnEmbed] });
  },
};