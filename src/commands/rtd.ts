import { Message, Client } from "discord.js";
import { PrefixCommand } from "../types";

const command: PrefixCommand = {
  name: "rtd",
  description: "Roll the Dice. Default is 1d6 (i>rtd 20 for a d20).",
  category: "Fun",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    let sides = 6;

    if (args[0]) {
      const parsed = parseInt(args[0]);
      if (!isNaN(parsed) && parsed > 1) {
        sides = parsed;
      } else {
        await message.reply("Please provide a valid number of sides (greater than 1).");
        return;
      }
    }

    const result = Math.floor(Math.random() * sides) + 1;
    await message.reply(`🎲 You rolled a **${result}** on a **${sides}-sided die**`);
  },
};

export = command;