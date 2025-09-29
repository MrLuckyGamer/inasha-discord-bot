const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
  name: "help",
  description: "Show all commands grouped by category.",
  category: "Utility",
  async execute(message) {
    const client = message.client;

    const categories = {};
    client.commands.forEach(cmd => {
      const category = cmd.category || "Uncategorized";
      if (!categories[category]) categories[category] = [];
      categories[category].push(`\`${config.prefix}${cmd.name}\` - ${cmd.description}`);
    });

    const embed = new EmbedBuilder()
      .setTitle("Help: List of Commands")
      .setColor(8388736)
      .setTimestamp();

    for (const [category, cmds] of Object.entries(categories)) {
      embed.addFields({ name: category, value: cmds.join("\n") });
    }

    message.channel.send({ embeds: [embed] });
  },
};