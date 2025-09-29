module.exports = {
  name: "ship",
  description: "Calculate love compatibility between two users.",
  category: "Fun",
  usage: "<@user1> <@user2>",
  async execute(message, args) {
    const user1 = message.mentions.users.first();
    const user2 = message.mentions.users.last();

    if (!user1 || !user2) return message.reply("Please mention **two users** to ship.");

    const percent = Math.floor(Math.random() * 101);
    let comment = "";

    if (percent > 90) comment = "A match made in heaven! 💖";
    else if (percent > 70) comment = "Looking good together! 💕";
    else if (percent > 40) comment = "Could work… 😅";
    else comment = "Maybe just friends… 💔";

    message.channel.send(`💞 **${user1.username}** + **${user2.username}** = **${percent}%** love compatibility! ${comment}`);
  },
};