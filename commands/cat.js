const { EmbedBuilder } = require("discord.js");
const https = require("https");

module.exports = {
  name: "cat",
  description: "Get a random cat image",
  category: "Fun",
  async execute(message) {
    const url = "https://api.thecatapi.com/v1/images/search";

    https.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json && json[0] && json[0].url) {
            const embed = new EmbedBuilder()
              .setColor("#00ff00")
              .setTitle("🐱 Here is your random cat!")
              .setImage(json[0].url)
              .setTimestamp();

            message.channel.send({ embeds: [embed] });
          } else {
            message.channel.send("Couldn't fetch a cat image. Try again!");
          }
        } catch (error) {
          console.error(error);
          message.channel.send("Error parsing cat data!");
        }
      });
    }).on("error", (error) => {
      console.error(error);
      message.channel.send("Failed to fetch cat image!");
    });
  },
};