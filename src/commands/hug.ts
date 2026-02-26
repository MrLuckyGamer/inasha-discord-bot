import { EmbedBuilder, Message, Client } from "discord.js";
import { PrefixCommand } from "../types";

const hugGifs = [
  "https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif",
  "https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif",
  "https://media.giphy.com/media/wnsgren9NtITS/giphy.gif",
  "https://media.giphy.com/media/143v0Z4767T15e/giphy.gif",
  "https://media.giphy.com/media/sUIZWMnfd4Mb6/giphy.gif",
  "https://media.giphy.com/media/xT39CXg70nNS0MFNLy/giphy.gif",
  "https://media.giphy.com/media/BXrwTdoho6hkQ/giphy.gif",
  "https://media.giphy.com/media/lrr9rHuoJOE0w/giphy.gif",
  "https://media.giphy.com/media/8tpiC1JAYVMFq/giphy.gif"
];

const command: PrefixCommand = {
  name: "hug",
  description: "Send a hug to someone!",
  category: "Fun",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    const user = message.mentions.users.first();
    if (!user) {
      await message.reply("Please mention someone to hug!");
      return;
    }

    const gif = hugGifs[Math.floor(Math.random() * hugGifs.length)];

    const embed = new EmbedBuilder()
      .setColor(6086089)
      .setTitle(`${message.author.username} hugged ${user.username}! 🤗`)
      .setImage(gif)
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};

export = command;