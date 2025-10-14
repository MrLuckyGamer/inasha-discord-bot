const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const WARN_FILE = path.join(__dirname, "../data/warns/warns.json");

if (!fs.existsSync(WARN_FILE)) {
  fs.mkdirSync(path.dirname(WARN_FILE), { recursive: true });
  fs.writeFileSync(WARN_FILE, "{}");
}

function loadWarns() {
  return JSON.parse(fs.readFileSync(WARN_FILE, "utf8"));
}

function saveWarns(data) {
  fs.writeFileSync(WARN_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "warn",
  description: "Warn, view, or delete warnings for users.",
  category: "Moderation",
  usage: "<@user> <reason> | view <@user> | delete <@user> <warnID>",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply("You need **Manage Messages** permission to use this command.");
    }

    if (!args.length)
      return message.reply("Usage: `i>warn <@user> <reason>` | `i>warn view <@user>` | `i>warn delete <@user> <warnID>`");

    const warns = loadWarns();
    const guildId = message.guild.id;

    if (!warns[guildId]) warns[guildId] = {};

    const sub = args[0].toLowerCase();

    const renderDate = (d) => {
      if (!d) return "Unknown date";
      if (typeof d === "number") return `<t:${d}:f>`;
      return `\`${d}\``;
    };

    if (sub === "view") {
      const member = message.mentions.members.first();
      if (!member) return message.reply("Please mention a user to view their warnings.");

      const userWarns = warns[guildId][member.id] || [];
      if (userWarns.length === 0) return message.reply(`${member.user.tag} has no warnings.`);

      const embed = new EmbedBuilder()
        .setTitle(`Warnings for ${member.user.tag}`)
        .setColor("Orange")
        .setDescription(
          userWarns
            .map(
              (w, i) =>
                `**#${i + 1}** — by ${w.moderatorTag}\n**Reason:** ${w.reason}\n*${renderDate(w.date)}*`
            )
            .join("\n\n")
        )
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }

    if (sub === "delete") {
      const member = message.mentions.members.first();
      if (!member) return message.reply("Please mention a user to delete their warning.");

      const index = parseInt(args[2]);
      if (isNaN(index)) return message.reply("Please specify a valid warning number to delete.");

      const userWarns = warns[guildId][member.id] || [];
      if (index < 1 || index > userWarns.length)
        return message.reply("That warning number does not exist.");

      const removed = userWarns.splice(index - 1, 1);
      warns[guildId][member.id] = userWarns;
      saveWarns(warns);

      const removedDate = removed[0].date;
      return message.reply(
        `Removed warning #${index} for ${member.user.tag} (Reason: ${removed[0].reason}) — ${renderDate(removedDate)}.`
      );
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply("Please mention a user to warn.");

    const reason = args.slice(1).join(" ");
    if (!reason) return message.reply("Please provide a reason for the warning.");

    if (!warns[guildId][member.id]) warns[guildId][member.id] = [];

    const warnEntry = {
      moderatorId: message.author.id,
      moderatorTag: message.author.tag,
      reason: reason,
      date: Math.floor(Date.now() / 1000),
    };

    warns[guildId][member.id].push(warnEntry);
    saveWarns(warns);

    const warnEmbed = new EmbedBuilder()
      .setTitle("User Warned")
      .setColor("Orange")
      .addFields(
        { name: "User", value: `${member.user.tag}`, inline: true },
        { name: "Warned By", value: `${message.author.tag}`, inline: true },
        { name: "Reason", value: reason },
        { name: "When", value: renderDate(warnEntry.date), inline: true }
      )
      .setTimestamp();

    await message.channel.send({ embeds: [warnEmbed] });
  },
};