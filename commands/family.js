const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const file = "./data/familytree/family.json";

let familyData = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : {};

function saveData() {
  fs.writeFileSync(file, JSON.stringify(familyData, null, 2));
}

module.exports = {
  name: "family",
  description: "Manage & view family tree (add/remove, parent/child).",
  category: "Fun",
  async execute(message, args) {
    const guildId = message.guild.id;
    const userId = message.author.id;

    if (!familyData[guildId]) familyData[guildId] = {};
    if (!familyData[guildId][userId]) {
      familyData[guildId][userId] = { parents: [], children: [] };
    }

    const subcommand = args[0]?.toLowerCase();
    const relation = args[1]?.toLowerCase();
    const target = message.mentions.users.first();

    if (!subcommand) {
      const family = familyData[guildId][userId];
      const parents = family.parents.length
        ? family.parents.map(id => `<@${id}>`).join("\n")
        : "None";
      const children = family.children.length
        ? family.children.map(id => `<@${id}>`).join("\n")
        : "None";

      let siblings = [];
      for (const [uid, info] of Object.entries(familyData[guildId])) {
        if (uid === userId) continue;
        if (info.parents.some(p => family.parents.includes(p))) siblings.push(`<@${uid}>`);
      }
      siblings = siblings.length ? siblings.join("\n") : "None";

    const embed = new EmbedBuilder()
      .setTitle(`${message.author.username}'s Family Tree`)
      .addFields(
        { name: "👨‍👩‍👧 Parents", value: parents || "None" },
        { name: "🧑‍🤝‍🧑 Siblings", value: siblings || "None" },
        { name: "👶 Children", value: children || "None" }
      )
        .setColor(8388736)
        .setTimestamp()
        .setFooter({ text: "Family Tree System" });

      return message.channel.send({ embeds: [embed] });
    }

    if (!target) return message.reply("You must mention a user for this command.");

    if (!familyData[guildId][target.id]) {
      familyData[guildId][target.id] = { parents: [], children: [] };
    }

    const targetData = familyData[guildId][target.id];
    const userData = familyData[guildId][userId];

    if (subcommand === "add") {
      if (relation === "parent") {
        if (!userData.parents.includes(target.id)) userData.parents.push(target.id);
        if (!targetData.children.includes(userId)) targetData.children.push(userId);

        saveData();
        return message.reply(`✅ Added <@${target.id}> as your parent.`);
      }

      if (relation === "child") {
        if (!userData.children.includes(target.id)) userData.children.push(target.id);
        if (!targetData.parents.includes(userId)) targetData.parents.push(userId);

        saveData();
        return message.reply(`✅ Added <@${target.id}> as your child.`);
      }

      return message.reply("Usage: `i>family add parent|child @user`");
    }

    if (subcommand === "remove") {
      if (relation === "parent") {
        userData.parents = userData.parents.filter(id => id !== target.id);
        targetData.children = targetData.children.filter(id => id !== userId);

        saveData();
        return message.reply(`✅ Removed <@${target.id}> as your parent.`);
      }

      if (relation === "child") {
        userData.children = userData.children.filter(id => id !== target.id);
        targetData.parents = targetData.parents.filter(id => id !== userId);

        saveData();
        return message.reply(`✅ Removed <@${target.id}> as your child.`);
      }

      return message.reply("Usage: `i>family remove parent|child @user`");
    }

    message.reply("Invalid command. Usage: `i>family`, `i>family add/remove parent|child @user`");
  }
};