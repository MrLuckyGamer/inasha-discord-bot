module.exports = {
  name: "purge",
  description: "Delete a number of messages from the channel.",
  category: "Moderation",
  async execute(message, args) {
    if (!message.member.permissions.has("ManageMessages"))
      return message.reply("You don’t have permission to manage messages.");

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0 || amount > 100)
      return message.reply("Please enter a number between **1 and 100**.");

    try {
      await message.channel.bulkDelete(amount, true);
      message.channel.send(`Deleted **${amount}** messages.`).then(msg => {
        setTimeout(() => msg.delete().catch(() => {}), 3000);
      });
    } catch (err) {
      console.error(err);
      message.reply("Could not delete messages.");
    }
  },
};