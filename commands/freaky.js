module.exports = {
  name: "freaky",
  description: "Check how freaky someone is!",
  category: "Fun",
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;

    const percent = Math.floor(Math.random() * 101);

    message.channel.send(`😈 ${target.username} is ${percent}% a freak!`);
  }
};