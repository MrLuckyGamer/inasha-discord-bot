const { EmbedBuilder } = require("discord.js");
const https = require("https");

module.exports = {
  name: "slap",
  description: "Slap someone playfully!",
  category: "Fun",
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply("Please mention someone to slap!");

    // Fetch a random slap GIF from Nekos.best API
    const url = "https://nekos.best/api/v2/slap";

    https.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json && json.results && json.results[0] && json.results[0].url) {
            const embed = new EmbedBuilder()
              .setColor(6086089)
              .setTitle(`${message.author.username} slapped ${user.username}! 👋`)
              .setImage(json.results[0].url)
              .setTimestamp();

            message.channel.send({ embeds: [embed] });
          } else {
            message.channel.send("Couldn't fetch a slap GIF. Try again!");
          }
        } catch (error) {
          console.error(error);
          message.channel.send("Error fetching slap GIF!");
        }
      });
    }).on("error", (error) => {
      console.error(error);
      message.channel.send("Failed to fetch slap GIF!");
    });
  },
};