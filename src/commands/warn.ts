import { PermissionFlagsBits, EmbedBuilder, Message, Client } from "discord.js";
import fs from "fs";
import path from "path";
import { PrefixCommand } from "../types";

const WARN_FILE = path.join(__dirname, "../../data/warns/warns.json");

if (!fs.existsSync(WARN_FILE)) {
  fs.mkdirSync(path.dirname(WARN_FILE), { recursive: true });
  fs.writeFileSync(WARN_FILE, "{}");
}

interface WarnEntry {
  moderatorId: string;
  moderatorTag: string;
  reason: string;
  date: number;
}

interface WarnData {
  [guildId: string]: {
    [userId: string]: WarnEntry[];
  };
}

function loadWarns(): WarnData {
  return JSON.parse(fs.readFileSync(WARN_FILE, "utf8"));
}

function saveWarns(data: WarnData): void {
  fs.writeFileSync(WARN_FILE, JSON.stringify(data, null, 2));
}

const command: PrefixCommand = {
  name: "warn",
  description: "Warn, view, or delete warnings for users.",
  category: "Moderation",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) {
      await message.reply("You need **Manage Messages** permission to use this command.");
      return;
    }

    if (!message.guild) {
      await message.reply("This command can only be used in a server.");
      return;
    }

    if (!args.length) {
      await message.reply("Usage: `i>warn <@user> <reason>` | `i>warn view <@user>` | `i>warn delete <@user> <warnID>`");
      return;
    }

    const warns = loadWarns();
    const guildId = message.guild.id;

    if (!warns[guildId]) warns[guildId] = {};

    const sub = args[0].toLowerCase();

    const renderDate = (d: number | string | undefined): string => {
      if (!d) return "Unknown date";
      if (typeof d === "number") return `<t:${d}:f>`;
      return `\`${d}\``;
    };

    if (sub === "view") {
      const member = message.mentions.members?.first();
      if (!member) {
        await message.reply("Please mention a user to view their warnings.");
        return;
      }

      const userWarns = warns[guildId][member.id] || [];
      if (userWarns.length === 0) {
        await message.reply(`${member.user.tag} has no warnings.`);
        return;
      }

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

      await message.channel.send({ embeds: [embed] });
      return;
    }

    if (sub === "delete") {
      const member = message.mentions.members?.first();
      if (!member) {
        await message.reply("Please mention a user to delete their warning.");
        return;
      }

      const index = parseInt(args[2]);
      if (isNaN(index)) {
        await message.reply("Please specify a valid warning number to delete.");
        return;
      }

      const userWarns = warns[guildId][member.id] || [];
      if (index < 1 || index > userWarns.length) {
        await message.reply("That warning number does not exist.");
        return;
      }

      const removed = userWarns.splice(index - 1, 1);
      warns[guildId][member.id] = userWarns;
      saveWarns(warns);

      const removedDate = removed[0].date;
      await message.reply(
        `Removed warning #${index} for ${member.user.tag} (Reason: ${removed[0].reason}) — ${renderDate(removedDate)}.`
      );
      return;
    }

    const member = message.mentions.members?.first();
    if (!member) {
      await message.reply("Please mention a user to warn.");
      return;
    }

    const reason = args.slice(1).join(" ");
    if (!reason) {
      await message.reply("Please provide a reason for the warning.");
      return;
    }

    if (!warns[guildId][member.id]) warns[guildId][member.id] = [];

    const warnEntry: WarnEntry = {
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

export = command;