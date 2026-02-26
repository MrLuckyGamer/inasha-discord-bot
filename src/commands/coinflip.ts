import { Message, Client } from "discord.js";
import { PrefixCommand } from "../types";

const command: PrefixCommand = {
  name: "coinflip",
  description: "Flip a coin.",
  category: "Fun",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    const result = Math.random() < 0.5 ? "Heads 🪙" : "Tails 🪙";
    await message.channel.send(`🎲 Coinflip result: **${result}**`);
  },
};

export = command;