module.exports = {
  name: "coinflip",
  description: "Flip a coin.",
  category: "Fun",
  async execute(message) {
    const result = Math.random() < 0.5 ? "Heads 🪙" : "Tails 🪙";
    message.channel.send(`🎲 Coinflip result: **${result}**`);
  },
};