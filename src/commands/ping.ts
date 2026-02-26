import { Message, Client } from "discord.js";
import { PrefixCommand } from "../types";

const command: PrefixCommand = {
  name: "ping",
  description: "Returns bot and API latency.",
  category: "Utility",
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    const sent = await message.channel.send("Pinging...");

    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiPingRaw = Math.round(client.ws.ping);
    const apiLatency = apiPingRaw < 0 ? "calculating..." : `${apiPingRaw}ms`;

    await sent.edit(
      `Pong!\n\n Message latency: **${latency}ms**\n API latency: **${apiLatency}**`
    );
  },
};

export = command;