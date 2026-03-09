const { EmbedBuilder } = require("discord.js");
const https = require("https");

module.exports = {
  name: "hug",
  description: "Send a hug to someone!",
  category: "Fun",
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply("Please mention someone to hug!");

    // Use waifu.pics API
    const options = {
      hostname: 'api.waifu.pics',
      path: '/sfw/hug',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json && json.url) {
            const embed = new EmbedBuilder()
              .setColor(6086089)
              .setTitle(`${message.author.username} hugged ${user.username}! 🤗`)
              .setImage(json.url)
              .setTimestamp();

            message.channel.send({ embeds: [embed] });
          } else {
            message.channel.send("Couldn't fetch a hug GIF. Try again!");
          }
        } catch (error) {
          console.error("Parse error:", error);
          console.error("Response data:", data);
          message.channel.send("Error fetching hug GIF!");
        }
      });
    });

    req.on("error", (error) => {
      console.error("Request error:", error);
      message.channel.send("Failed to fetch hug GIF!");
    });

    req.end();
  },
};