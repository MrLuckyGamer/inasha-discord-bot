module.exports = {
  name: "ping",
  description: "Returns bot and API latency.",
  category: "Utility",
  async execute(message, args, client) {
    const sent = await message.channel.send("Pinging...");

    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiPingRaw = Math.round(client.ws.ping);
    const apiLatency = apiPingRaw < 0 ? "calculating..." : `${apiPingRaw}ms`;

    sent.edit(
      `Pong!\n\n Message latency: **${latency}ms**\n API latency: **${apiLatency}**`
    );
  },
};