module.exports = {
  name: "kick",
  description: "Kick a user from the server.",
  category: "Moderation",
  async execute(message, args) {
    if (!message.member.permissions.has("KickMembers"))
      return message.reply("You don’t have permission to kick members.");

    const user = message.mentions.members.first();
    if (!user) return message.reply("You must mention a user to kick.");

    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      await user.kick(reason);
      message.channel.send(`Kicked **${user.user.tag}** | Reason: *${reason}*`);
    } catch (err) {
      console.error(err);
      message.reply("I was unable to kick that user.");
    }
  },
};