const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "lock",
  description: "Lock the current channel.",
  category: "Moderation",
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
      return message.reply("You need **Manage Channels** permission.");

    await message.channel.permissionOverwrites.edit(message.guild.id, {
      ViewChannel: false,
    });

    message.reply("Channel locked!");
  },
};