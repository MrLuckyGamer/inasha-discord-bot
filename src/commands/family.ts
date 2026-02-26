import fs from "fs";
import { EmbedBuilder, Message, Client } from "discord.js";
import { PrefixCommand } from "../types";

const file = "./data/familytree/family.json";

interface FamilyMember {
  parents: string[];
  children: string[];
}

interface FamilyData {
  [guildId: string]: {
    [userId: string]: FamilyMember;
  };
}

let familyData: FamilyData = fs.existsSync(file) 
  ? JSON.parse(fs.readFileSync(file, "utf8")) 
  : {};

function saveData(): void {
  fs.writeFileSync(file, JSON.stringify(familyData, null, 2));
}

const command: PrefixCommand = {
  name: "family",
  description: "Manage & view family tree (add/remove, parent/child).",
  category: "Fun",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    if (!message.guild) {
      await message.reply("This command can only be used in a server.");
      return;
    }

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

      let siblings: string[] = [];
      for (const [uid, info] of Object.entries(familyData[guildId])) {
        if (uid === userId) continue;
        if (info.parents.some(p => family.parents.includes(p))) siblings.push(`<@${uid}>`);
      }
      const siblingsStr = siblings.length ? siblings.join("\n") : "None";

      const embed = new EmbedBuilder()
        .setTitle(`${message.author.username}'s Family Tree`)
        .addFields(
          { name: "👨‍👩‍👧 Parents", value: parents || "None" },
          { name: "🧑‍🤝‍🧑 Siblings", value: siblingsStr || "None" },
          { name: "👶 Children", value: children || "None" }
        )
        .setColor(6086089)
        .setTimestamp()
        .setFooter({ text: "Family Tree System" });

      await message.channel.send({ embeds: [embed] });
      return;
    }

    if (!target) {
      await message.reply("You must mention a user for this command.");
      return;
    }

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
        await message.reply(`✅ Added <@${target.id}> as your parent.`);
        return;
      }

      if (relation === "child") {
        if (!userData.children.includes(target.id)) userData.children.push(target.id);
        if (!targetData.parents.includes(userId)) targetData.parents.push(userId);

        saveData();
        await message.reply(`✅ Added <@${target.id}> as your child.`);
        return;
      }

      await message.reply("Usage: `i>family add parent|child @user`");
      return;
    }

    if (subcommand === "remove") {
      if (relation === "parent") {
        userData.parents = userData.parents.filter(id => id !== target.id);
        targetData.children = targetData.children.filter(id => id !== userId);

        saveData();
        await message.reply(`✅ Removed <@${target.id}> as your parent.`);
        return;
      }

      if (relation === "child") {
        userData.children = userData.children.filter(id => id !== target.id);
        targetData.parents = targetData.parents.filter(id => id !== userId);

        saveData();
        await message.reply(`✅ Removed <@${target.id}> as your child.`);
        return;
      }

      await message.reply("Usage: `i>family remove parent|child @user`");
      return;
    }

    await message.reply("Invalid command. Usage: `i>family`, `i>family add/remove parent|child @user`");
  }
};

export = command;