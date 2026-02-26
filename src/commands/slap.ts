import { EmbedBuilder, Message, Client } from "discord.js";
import { PrefixCommand } from "../types";

const slapGifs = [
  "https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif",
  "https://media.giphy.com/media/mEtSQlxqBtWWA/giphy.gif",
  "https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif",
  "https://media.giphy.com/media/Zau0yrl17uzdK/giphy.gif",
  "https://media.giphy.com/media/3XlEk2RxPS1m8/giphy.gif",
  "https://media.giphy.com/media/RXGNsyRb1hDJm/giphy.gif"
];

const command: PrefixCommand = {
  name: "slap",
  description: "Slap someone playfully!",
  category: "Fun",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    const user = message.mentions.users.first();
    if (!user) {
      await message.reply("Please mention someone to slap!");
      return;
    }

    const gif = slapGifs[Math.floor(Math.random() * slapGifs.length)];

    const embed = new EmbedBuilder()
      .setColor(6086089)
      .setTitle(`${message.author.username} slapped ${user.username}! 👋`)
      .setImage(gif)
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};

export = command;