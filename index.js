const { Client, GatewayIntentBits, Collection, EmbedBuilder, REST, Routes, MessageFlags, Partials, } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const { updateStats } = require("./commands/serverstats.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel], // Required for DMs
});

// === Command Loading ===
client.commands = new Collection();
client.slashCommands = new Collection();

// Prefix Commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Slash Commands
const slashPath = path.join(__dirname, "slash-commands");
const slashJSON = [];
const slashFiles = fs.existsSync(slashPath)
  ? fs.readdirSync(slashPath).filter(f => f.endsWith(".js"))
  : [];

for (const file of slashFiles) {
  const command = require(`./slash-commands/${file}`);
  client.slashCommands.set(command.data.name, command);
  slashJSON.push(command.data.toJSON());
}

// === Register Global Slash Commands ===
const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log("Cleaning and registering global slash commands...");

    // Delete old global commands not in slashJSON
    const existingGlobal = await rest.get(Routes.applicationCommands(config.clientId));
    for (const cmd of existingGlobal) {
      if (!slashJSON.some(c => c.name === cmd.name)) {
        console.log(`Deleting old global slash command: ${cmd.name}`);
        await rest.delete(Routes.applicationCommand(config.clientId, cmd.id));
      }
    }

    // Register new slash commands
    await rest.put(Routes.applicationCommands(config.clientId), { body: slashJSON });
    console.log("Global slash commands registered successfully (usable in DMs + servers).");
  } catch (error) {
    console.error("Failed to update slash commands:", error);
  }
})();

// === Event Handlers ===
client.on("guildMemberAdd", member => updateStats(member.guild));
client.on("guildMemberRemove", member => updateStats(member.guild));
client.on("channelCreate", channel => updateStats(channel.guild));
client.on("channelDelete", channel => updateStats(channel.guild));

client.once("clientReady", async () => {
  let totalUsers = 0;
  let totalChannels = 0;

  for (const guild of client.guilds.cache.values()) {
    await guild.members.fetch();
    totalUsers += guild.members.cache.filter(m => !m.user.bot).size;
    totalChannels += guild.channels.cache.size;
  }

  console.log("==========================");
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Serving in ${client.guilds.cache.size} servers`);
  console.log(`Watching over ${totalUsers} users`);
  console.log(`Monitoring ${totalChannels} channels`);
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
    for (const guildId of Object.keys(statsData)) {
      const guild = client.guilds.cache.get(guildId);
      if (guild) await updateStats(guild);
    }
  }

  setInterval(() => {
    client.guilds.cache.forEach(guild => updateStats(guild));
  }, 10 * 60 * 1000);
});

// === Prefix Commands ===
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  const prefix = config.prefix.toLowerCase();
  const content = message.content.toLowerCase();
  if (!content.startsWith(prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.");
  }
});

// === Fun Responses ===
client.on("messageCreate", message => {
  if (message.author.bot) return;
  const lower = message.content.toLowerCase();

  if (lower.includes("meow")) {
    const responses = [
      "Meow! 🐱", "😺 Meow meow!", "Mew~", "Purr~ 😻", "Nya~ ✨",
      "Meeew!", "Mrowww 🐈", "*eepy meow...* 💤", "MEOW!!",
      "UwU nya~", "🐾 *pounces on you* meow!", "Mrrrp!", "Myaa~ 🌸", "Mrow? 🐱",
    ];
    message.channel.send(responses[Math.floor(Math.random() * responses.length)]);
  }

  const dogWords = ["woof", "bark", "bork", "ruff", "arf"];
  if (dogWords.some(word => lower.includes(word))) {
    const responses = [
      "Woof! 🐶", "Bark bark! 🐾", "bork bork! 🐕", "Arf arf!", "Ruff~ 🐕",
      "Woooof! 😄", "🐕 *wags tail excitedly*", "Grr... just kidding! 🐶❤️",
      "*tilts head* arf?", "Awoo~ 🌕🐺", "*runs in circles* WOOF!",
      "Borf borf! 🐾", "🐶 *gives you a slobbery kiss*", "Wag wag wag! 🦴",
      "Ruff ruff!!", "🐕‍🦺 *sits like a good boi*",
    ];
    message.channel.send(responses[Math.floor(Math.random() * responses.length)]);
  }
});

// === Funny Guild-only Filter ===
const TARGET_GUILD_ID = "1179224793078300672";
const bannedWords = ["nig", "nigga", "nigger", "fag", "faggot"];

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (message.guild?.id !== TARGET_GUILD_ID) return;

  const content = message.content.toLowerCase();
  const isBanned = bannedWords.some(word => new RegExp(`\\b${word}\\b`, "i").test(content));
  if (isBanned) {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🚨 Slur Detected!")
      .setDescription(`${message.author} watch your language!`)
      .setImage("https://i.imgur.com/0bkSmUl.png")
      .setTimestamp();
    await message.channel.send({ embeds: [embed] });
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