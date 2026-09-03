const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { getCounting, enableCounting, disableCounting } = require("../utils/countingStore.js");

module.exports = {
  name: "counting",
  aliases: ["count"],
  description: "Enable or disable the counting game in this channel.",
  category: "Utility",
  usage: "counting <enable|disable|status>",
  async execute(message, args) {
    if (!message.guild) return message.reply("This command can only be used in a server.");

    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      const noPermEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("You need **Manage Server** permission to use this command.");
      return message.channel.send({ embeds: [noPermEmbed] });
    }

    const action = args[0]?.toLowerCase();
    const state = getCounting(message.guild.id);

    // === STATUS (no args, or `status`) ===
    if (!action || action === "status") {
      if (!state) {
        return message.reply(
          "🔢 Counting is currently **disabled** in this server.\n\nUsage: `counting enable` in the channel you want to use."
        );
      }
      return message.reply(
        `🔢 Counting is **enabled** in <#${state.channelId}>.\n` +
          `Current count: **${state.count}** — next number is **${state.count + 1}**.`
      );
    }

    // === ENABLE ===
    if (action === "enable" || action === "on") {
      enableCounting(message.guild.id, message.channel.id);
      return message.reply("🔢 Counting game **enabled** in this channel! Start counting from **1**.");
    }

    // === DISABLE ===
    if (action === "disable" || action === "off") {
      if (!state) return message.reply("Counting is already disabled in this server.");
      disableCounting(message.guild.id);
      return message.reply("🔢 Counting game **disabled**.");
    }

    return message.reply("Usage: `counting <enable|disable|status>`");
  },
};
