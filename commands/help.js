const { EmbedBuilder } = require("discord.js");
const prefix = process.env.prefix || "i>";

module.exports = {
  name: "help",
  description: "Show all commands grouped by category.",
  category: "Utility",
  async execute(message) {
    const client = message.client;

    const categories = {};
    const seen = new Set();
    client.commands.forEach(cmd => {
      if (seen.has(cmd.name)) return; // avoid listing a command once per alias
      seen.add(cmd.name);
      const category = cmd.category || "Uncategorized";
      if (!categories[category]) categories[category] = [];
      categories[category].push(`\`${prefix}${cmd.name}\` - ${cmd.description}`);
    });

    const embed = new EmbedBuilder()
      .setTitle("Help: List of Commands")
      .setColor(6086089)
      .setTimestamp();

    for (const [category, cmds] of Object.entries(categories)) {
      embed.addFields({ name: category, value: cmds.join("\n") });
    }

    message.channel.send({ embeds: [embed] });
  },
};