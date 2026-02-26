import { 
  Client, 
  GatewayIntentBits, 
  Collection, 
  EmbedBuilder, 
  REST, 
  Routes, 
  MessageFlags, 
  Partials,
  ActivityType
} from "discord.js";
import fs from "fs";
import path from "path";
import { BotConfig, ExtendedClient, PrefixCommand, SlashCommand } from "./types";
import { updateStats } from "./commands/serverstats";

const config: BotConfig = {
  token: process.env.token || "",
  prefix: process.env.prefix || "!",
  clientId: process.env.clientId || "",
  guildId: process.env.guildId || ""
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
}) as ExtendedClient;

// === Command Collections ===
client.commands = new Collection<string, PrefixCommand>();
client.slashCommands = new Collection<string, SlashCommand>();

// === Load Prefix Commands ===
const commandsPath = path.join(__dirname, "commands");

function loadCommands(dir: string): void {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      loadCommands(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      const command = require(filePath) as { default?: PrefixCommand } | PrefixCommand;
      const cmd = 'default' in command ? command.default : command;
      if (cmd?.name) {
        client.commands.set(cmd.name, cmd);
      }
    }
  }
}

if (fs.existsSync(commandsPath)) {
  loadCommands(commandsPath);
}

// === Load Slash Commands ===
const slashPath = path.join(__dirname, "slash-commands");
const slashJSON: any[] = [];

if (fs.existsSync(slashPath)) {
  const slashFiles = fs.readdirSync(slashPath).filter(f => f.endsWith(".ts") || f.endsWith(".js"));
  for (const file of slashFiles) {
    const command = require(path.join(slashPath, file)) as { default?: SlashCommand } | SlashCommand;
    const cmd = 'default' in command ? command.default : command;
    if (cmd?.data) {
      client.slashCommands.set(cmd.data.name, cmd);
      slashJSON.push(cmd.data.toJSON());
    }
  }
}

// === Register Global Slash Commands ===
const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    const existingGlobal = await rest.get(Routes.applicationCommands(config.clientId)) as any[];

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
  try { 
    updateStats(member.guild); 
  } catch (e) { 
    console.error(e); 
  }
});

client.on("guildMemberRemove", member => {
  try { 
    updateStats(member.guild); 
  } catch (e) { 
    console.error(e); 
  }
});

client.on("channelCreate", channel => {
  if (!channel.guild) return;
  try { 
    updateStats(channel.guild); 
  } catch (e) { 
    console.error(e); 
  }
});

client.on("channelDelete", channel => {
  if (!channel.guild) return;
  try { 
    updateStats(channel.guild); 
  } catch (e) { 
    console.error(e); 
  }
});

// === Ready Event ===
client.once("clientReady", async () => {
  try {
    let totalUsers = 0;

    for (const guild of client.guilds.cache.values()) {
      totalUsers += guild.memberCount;
    }

    console.log("==========================");
    console.log(`Logged in as ${client.user?.tag}`);
    console.log(`Serving in ${client.guilds.cache.size} servers`);
    console.log(`Watching over ${totalUsers} users`);
    console.log("==========================");

    client.user?.setPresence({
      status: "online",
      activities: [
        {
          name: `${config.prefix}help`,
          type: ActivityType.Streaming,
          url: "https://twitch.tv/femboyyluckyy",
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
        try { 
          updateStats(guild); 
        } catch (e) { 
          console.error(e); 
        }
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
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = client.commands.get(commandName);
    if (command) {
      try {
        await command.execute(message, args, client);
      } catch (error) {
        console.error(error);
        message.reply("There was an error executing that command.");
      }
    }
  }

  // === Fun Cat Responses ===
  if (lower.includes("meow")) {
    const responses = [
      "Meow! 🐱", "😺 Meow meow!", "Mew~", "Purr~ 😻", "Nya~ ✨",
      "*eepy meow...* 💤", "MEOW!!", "🐾 *pounces on you* meow!"
    ];
    return message.channel.send(responses[Math.floor(Math.random() * responses.length)]);
  }

  // === Dog Responses ===
  const dogWords = ["woof", "bark", "bork", "ruff", "arf"];
  if (dogWords.some(word => lower.includes(word))) {
    const responses = [
      "Woof! 🐶", "Bark bark! 🐾", "bork bork!", "Ruff~ 🐕",
      "*wags tail excitedly*", "🐶 *gives you a slobbery kiss*"
    ];
    return message.channel.send(responses[Math.floor(Math.random() * responses.length)]);
  }

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