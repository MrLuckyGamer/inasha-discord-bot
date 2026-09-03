const { Client, GatewayIntentBits, Collection, EmbedBuilder, REST, Routes, MessageFlags, Partials, } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = {
  token: process.env.token,
  prefix: process.env.prefix,
  clientId: process.env.clientId,
  guildId: process.env.guildId
};
const { updateStats } = require("./commands/serverstats.js");
const { autoresponses } = require("./utils/autoresponses.js");
const { isEnabled: isAutoresponseEnabled } = require("./utils/autoresponseStore.js");
const { getCounting, setCount } = require("./utils/countingStore.js");
const { parseCountingNumber } = require("./utils/parseNumber.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

// === Command Collections ===
client.commands = new Collection();
client.slashCommands = new Collection();

// === Load Prefix Commands ===
const commandsPath = path.join(__dirname, "commands");
function loadCommands(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      loadCommands(filePath);
    } else if (file.endsWith('.js')) {
      const command = require(filePath);
      if (command?.name) {
        client.commands.set(command.name, command);
        for (const alias of command.aliases ?? []) {
          client.commands.set(alias, command);
        }
      }
    }
  }
}
if (fs.existsSync(commandsPath)) {
  loadCommands(commandsPath);
}

// === Load Slash Commands ===
const slashPath = path.join(__dirname, "slash-commands");
const slashJSON = [];
if (fs.existsSync(slashPath)) {
  const slashFiles = fs.readdirSync(slashPath).filter(f => f.endsWith(".js"));
  for (const file of slashFiles) {
    const command = require(`./slash-commands/${file}`);
    if (command?.data) {
      client.slashCommands.set(command.data.name, command);
      slashJSON.push(command.data.toJSON());
    }
  }
}

// === Register Global Slash Commands ===
const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    const existingGlobal = await rest.get(Routes.applicationCommands(config.clientId));

    for (const cmd of existingGlobal) {
      if (!slashJSON.some(c => c.name === cmd.name)) {
        await rest.delete(Routes.applicationCommand(config.clientId, cmd.id));
      }
    }

    await rest.put(Routes.applicationCommands(config.clientId), { body: slashJSON });
  } catch (error) {
    console.error("Failed to update slash commands:", error);
  }
})();

client.on("guildMemberAdd", member => {
  try { updateStats(member.guild); } catch (e) { console.error(e); }
});

client.on("guildMemberRemove", member => {
  try { updateStats(member.guild); } catch (e) { console.error(e); }
});

client.on("channelCreate", channel => {
  if (!channel.guild) return;
  try { updateStats(channel.guild); } catch (e) { console.error(e); }
});

client.on("channelDelete", channel => {
  if (!channel.guild) return;
  try { updateStats(channel.guild); } catch (e) { console.error(e); }
});

// === Ready Event ===
client.once("clientReady", async () => {
  try {
    let totalUsers = 0;

    for (const guild of client.guilds.cache.values()) {
      totalUsers += guild.memberCount;
    }

    console.log("==========================");
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Serving in ${client.guilds.cache.size} servers`);
    console.log(`Watching over ${totalUsers} users`);
    console.log("==========================");

    client.user.setPresence({
      status: "online", // online, idle, dnd, invisible
      activities: [
        {
          name: `${config.prefix}help`,
          type: 1, // 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching, 4 = Custom
          url: "https://twitch.tv/femboyyluckyy", // Only needed if type is 1 (Streaming)
        },
      ],
    });

    const statsFile = "./data/serverstats/serverstats.json";
    if (fs.existsSync(statsFile)) {
      const statsData = JSON.parse(fs.readFileSync(statsFile, "utf8"));
      const guildIds = Object.keys(statsData);
      
      console.log(`Will update stats for ${guildIds.length} servers over the next ${Math.ceil(guildIds.length * 10 / 60)} minutes...`);

      for (let i = 0; i < guildIds.length; i++) {
        const guildId = guildIds[i];
        const guild = client.guilds.cache.get(guildId);
        if (guild) {
          setTimeout(() => {
            updateStats(guild).catch(err => console.error(`Stats update error for ${guild.name}:`, err));
          }, i * 10000);
        }
      }
    }

    setInterval(() => {
      client.guilds.cache.forEach(guild => {
        try { updateStats(guild); } catch (e) { console.error(e); }
      });
    }, 10 * 60 * 1000);
  } catch (err) {
    console.error("Error during ready handler:", err);
  }
});

// === Message Handler ===
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  const lower = message.content.toLowerCase();
  const prefix = config.prefix.toLowerCase();

  // === Prefix Commands ===
  if (lower.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (command) {
      try {
        await command.execute(message, args, client);
      } catch (error) {
        console.error(error);
        message.reply("There was an error executing that command.");
      }
    }
    return;
  }

  // === Counting channel (toggleable per server) ===
  if (message.guild) {
    const counting = getCounting(message.guild.id);
    if (counting && message.channel.id === counting.channelId) {
      const trimmed = message.content.trim();

      // Accepts plain digits ("42") and spelled-out numbers ("forty two").
      // Anything else (chat, emoji, etc.) in the channel is left alone.
      const parsed = parseCountingNumber(trimmed);

      if (parsed !== null) {
        const expected = counting.count + 1;

        if (parsed === expected && message.author.id === counting.lastUserId) {
          try {
            await message.react("🚫");
          } catch (err) {
            console.error("Failed to react to counting message:", err);
          }
          try {
            await message.reply(
              `🚫 You can't count twice in a row! Let someone else go next.`
            );
          } catch (err) {
            console.error("Failed to send counting reset reply:", err);
          }
        } else if (parsed === expected) {
          setCount(message.guild.id, expected, message.author.id);
          try {
            await message.react("✅");
          } catch (err) {
            console.error("Failed to react to counting message:", err);
          }
        } else {
          setCount(message.guild.id, 0, null);
          try {
            await message.react("❌");
          } catch (err) {
            console.error("Failed to react to counting message:", err);
          }
          try {
            await message.reply(
              `❌ Wrong number! I was expecting **${expected}**. The count has been reset — start again from **1**.`
            );
          } catch (err) {
            console.error("Failed to send counting reset reply:", err);
          }
        }
      }

      return;
    }
  }

  // === Chat auto-responses (cat/dog etc., toggleable per server) ===
  for (const [type, entry] of Object.entries(autoresponses)) {
    if (!entry.triggers.some(word => lower.includes(word))) continue;
    if (!message.guild || !isAutoresponseEnabled(message.guild.id, type)) break;

    const replies = entry.replies;
    return message.reply(replies[Math.floor(Math.random() * replies.length)]);
  }

  // === Guild-only Slur Filter ===
  const TARGET_GUILD_ID = "1179224793078300672";
  const bannedWords = ["nig", "fag", "faggot", "nigger", "nigga"];

  if (message.guild?.id === TARGET_GUILD_ID) {
    if (bannedWords.some(word => new RegExp(`\\b${word}\\b`, "i").test(lower))) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚨 Slur Detected!")
        .setDescription(`${message.author} watch your language!`)
        .setImage("https://i.imgur.com/LQmggjY.png")
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }
  }
});

// === Slash Command Execution ===
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error executing this command.",
      flags: MessageFlags.Ephemeral,
    });
  }
});

// === Log server join/leave ===
client.on("guildCreate", guild => {
  console.log("====================================");
  console.log(`Added to: ${guild.name} (ID: ${guild.id})`);
  console.log(`Members: ${guild.memberCount}`);
  console.log(`Total Servers: ${client.guilds.cache.size}`);
  console.log("====================================");
});

client.on("guildDelete", guild => {
  console.log("====================================");
  console.log(`Removed from: ${guild.name} (ID: ${guild.id})`);
  console.log(`Total Servers: ${client.guilds.cache.size}`);
  console.log("====================================");
});

// === Login ===
client.login(config.token);