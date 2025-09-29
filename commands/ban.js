module.exports = {
  name: "ban",
  description: "Ban a user from the server.",
  category: "Moderation",
  async execute(message, args) {
    if (!message.member.permissions.has("BanMembers"))
      return message.reply("You don’t have permission to ban members.");

    const user = message.mentions.members.first();
    if (!user) return message.reply("You must mention a user to ban.");

    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      await user.ban({ reason });
      message.channel.send(`Banned **${user.user.tag}** | Reason: *${reason}*`);
    } catch (err) {
      console.error(err);
      message.reply("I was unable to ban that user.");
    }
  },
};