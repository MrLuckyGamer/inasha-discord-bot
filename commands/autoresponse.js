const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { autoresponses } = require("../utils/autoresponses.js");
const { isEnabled, setEnabled } = require("../utils/autoresponseStore.js");

module.exports = {
  name: "autoresponse",
  aliases: ["ar", "autoreply"],
  description: "Enable or disable the cat/dog chat auto-replies for this server.",
  category: "Utility",
  async execute(message, args) {
    if (!message.guild) return message.reply("This command can only be used in a server.");

    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      const noPermEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("You need **Manage Server** permission to use this command.");
      return message.channel.send({ embeds: [noPermEmbed] });
    }

    const type = args[0]?.toLowerCase();

    // === STATUS (no args, or `status`) ===
    if (!type || type === "status") {
      const lines = Object.entries(autoresponses).map(([key, cfg]) => {
        const enabled = isEnabled(message.guild.id, key);
        return `${cfg.emoji} **${cfg.label}** — ${enabled ? "enabled ✅" : "disabled ❌"}`;
      });
      const types = Object.keys(autoresponses).join("|");
      const embed = new EmbedBuilder()
        .setColor(6086089)
        .setTitle("Auto-response status")
        .setDescription(lines.join("\n"))
        .setFooter({ text: `Usage: autoresponse <${types}> <on|off>` });
      return message.channel.send({ embeds: [embed] });
    }

    if (!autoresponses[type]) {
      const types = Object.keys(autoresponses).join(", ");
      return message.reply(`Unknown auto-response type \`${type}\`. Valid types: ${types}.`);
    }

    const action = args[1]?.toLowerCase();
    if (!action || !["on", "off", "enable", "disable"].includes(action)) {
      return message.reply(`Usage: \`autoresponse ${type} <on|off>\``);
    }

    const enabled = action === "on" || action === "enable";
    setEnabled(message.guild.id, type, enabled);

    const { emoji, label } = autoresponses[type];
    return message.reply(`${emoji} **${label}** are now **${enabled ? "enabled" : "disabled"}** in this server.`);
  },
};
