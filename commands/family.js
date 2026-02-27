const { EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  name: "family",
  description: "Manage & view family tree (add/remove, parent/child).",
  category: "Fun",
  async execute(message, args) {
    try {
      const guildId = message.guild.id;
      const userId = message.author.id;

      const subcommand = args[0]?.toLowerCase();
      const relation = args[1]?.toLowerCase();
      const target = message.mentions.users.first();

      // View family tree
      if (!subcommand) {
        const parents = await db.getFamilyParents(guildId, userId);
        const children = await db.getFamilyChildren(guildId, userId);

        const parentsText = parents.length
          ? parents.map(id => `<@${id}>`).join("\n")
          : "None";
        const childrenText = children.length
          ? children.map(id => `<@${id}>`).join("\n")
          : "None";

        // Find siblings (users who share at least one parent)
        const allMembers = await db.getAllFamilyMembers(guildId);
        const siblings = new Set();

        for (const member of allMembers) {
          if (member.user_id === userId) continue;
          if (parents.includes(member.parent_id)) {
            siblings.add(member.user_id);
          }
        }

        const siblingsText = siblings.size > 0
          ? Array.from(siblings).map(id => `<@${id}>`).join("\n")
          : "None";

        const embed = new EmbedBuilder()
          .setTitle(`${message.author.username}'s Family Tree`)
          .addFields(
            { name: "👨‍👩‍👧 Parents", value: parentsText },
            { name: "🧑‍🤝‍🧑 Siblings", value: siblingsText },
            { name: "👶 Children", value: childrenText }
          )
          .setColor(6086089)
          .setTimestamp()
          .setFooter({ text: "Family Tree System" });

        return message.channel.send({ embeds: [embed] });
      }

      if (!target) return message.reply("You must mention a user for this command.");

      // Add family relation
      if (subcommand === "add") {
        if (relation === "parent") {
          await db.addFamilyRelation(guildId, userId, target.id);
          return message.reply(`✅ Added <@${target.id}> as your parent.`);
        }

        if (relation === "child") {
          await db.addFamilyRelation(guildId, target.id, userId);
          return message.reply(`✅ Added <@${target.id}> as your child.`);
        }

        return message.reply("Usage: `i>family add parent|child @user`");
      }

      // Remove family relation
      if (subcommand === "remove") {
        if (relation === "parent") {
          await db.removeFamilyRelation(guildId, userId, target.id);
          return message.reply(`✅ Removed <@${target.id}> as your parent.`);
        }

        if (relation === "child") {
          await db.removeFamilyRelation(guildId, target.id, userId);
          return message.reply(`✅ Removed <@${target.id}> as your child.`);
        }

        return message.reply("Usage: `i>family remove parent|child @user`");
      }

      message.reply("Invalid command. Usage: `i>family`, `i>family add/remove parent|child @user`");
    } catch (error) {
      console.error('Error in family command:', error);
      message.reply("An error occurred while managing the family tree. Please try again later.");
    }
  }
};