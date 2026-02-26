import { Message, Client } from "discord.js";
import { PrefixCommand } from "../types";

const command: PrefixCommand = {
  name: "roll",
  description: "Roll a random number between 0 and 100.",
  category: "Fun",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    const result = Math.floor(Math.random() * 101);
    await message.channel.send(`🎲 ${message.author.username} rolled a **${result}**!`);
  },
};

export = command;