import { Message, Client } from "discord.js";
import { PrefixCommand } from "../types";

const command: PrefixCommand = {
  name: "freaky",
  description: "Check how freaky someone is!",
  category: "Fun",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    const target = message.mentions.users.first() || message.author;
    const percent = Math.floor(Math.random() * 101);
    await message.channel.send(`😈 ${target.username} is ${percent}% a freak!`);
  }
};

export = command;