const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

const renderDate = (d) => {
  if (!d) return "Unknown date";
  if (typeof d === "number") return `<t:${d}:f>`;
  return `\`${d}\``;
};

module.exports = {
  name: "warn",
  description: "Warn, view, or delete warnings for users.",
  category: "Moderation",
  usage: "<@user> <reason> | view <@user> | delete <@user> <warnID>",
  async execute(message, args) {
    try {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return message.reply("You need **Manage Messages** permission to use this command.");
      }

      if (!args.length) {
        return message.reply("Usage: `i>warn <@user> <reason>` | `i>warn view <@user>` | `i>warn delete <@user> <warnID>`");
      }

      const guildId = message.guild.id;
      const sub = args[0].toLowerCase();

      // === VIEW WARNINGS ===
      if (sub === "view") {
        const member = message.mentions.members.first();
        if (!member) return message.reply("Please mention a user to view their warnings.");

        const userWarns = await db.getUserWarnings(guildId, member.id);
        
        if (userWarns.length === 0) {
          return message.reply(`${member.user.tag} has no warnings.`);
        }

        const embed = new EmbedBuilder()
          .setTitle(`Warnings for ${member.user.tag}`)
          .setColor("Orange")
          .setDescription(
            userWarns
              .map((w, i) =>
                `**#${w.id}** — by ${w.moderator_tag}\n**Reason:** ${w.reason}\n*${renderDate(w.warn_date)}*`
              )
              .join("\n\n")
          )
          .setTimestamp();

        return message.channel.send({ embeds: [embed] });
      }

      // === DELETE WARNING ===
      if (sub === "delete") {
        const member = message.mentions.members.first();
        if (!member) return message.reply("Please mention a user to delete their warning.");

        const warningId = parseInt(args[2]);
        if (isNaN(warningId)) return message.reply("Please specify a valid warning ID to delete.");

        const deleted = await db.deleteWarning(guildId, member.id, warningId);
        
        if (!deleted) {
          return message.reply("That warning ID does not exist for this user.");
        }

        return message.reply(
          `Removed warning #${warningId} for ${member.user.tag} (Reason: ${deleted.reason}) — ${renderDate(deleted.warn_date)}.`
        );
      }

      // === ADD WARNING ===
      const member = message.mentions.members.first();
      if (!member) return message.reply("Please mention a user to warn.");

      const reason = args.slice(1).join(" ");
      if (!reason) return message.reply("Please provide a reason for the warning.");

      const warnDate = Math.floor(Date.now() / 1000);
      const warningId = await db.addWarning(
        guildId,
        member.id,
        message.author.id,
        message.author.tag,
        reason,
        warnDate
      );

      const warnEmbed = new EmbedBuilder()
        .setTitle("User Warned")
        .setColor("Orange")
        .addFields(
          { name: "User", value: `${member.user.tag}`, inline: true },
          { name: "Warned By", value: `${message.author.tag}`, inline: true },
          { name: "Reason", value: reason },
          { name: "When", value: renderDate(warnDate), inline: true },
          { name: "Warning ID", value: `#${warningId}`, inline: true }
        )
        .setTimestamp();

      await message.channel.send({ embeds: [warnEmbed] });
    } catch (error) {
      console.error('Error in warn command:', error);
      message.reply("An error occurred while processing the warning. Please try again later.");
    }
  },
};