const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
  REST,
  Routes,
  Partials,
  ActivityType
} = require("discord.js");

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
  partials: [Partials.Channel],
});

client.commands = new Collection();
client.slashCommands = new Collection();

const commandsPath = path.join(__dirname, "commands");
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command?.name) client.commands.set(command.name, command);
  }
}

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

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log("Cleaning and registering global slash commands...");

    const existingGlobal = await rest.get(Routes.applicationCommands(config.clientId));

    for (const cmd of existingGlobal) {
      if (!slashJSON.some(c => c.name === cmd.name)) {
        console.log(`Deleting old global slash command: ${cmd.name}`);
        await rest.delete(Routes.applicationCommand(config.clientId, cmd.id));
      }
    }

    await rest.put(Routes.applicationCommands(config.clientId), { body: slashJSON });
    console.log("Global slash commands registered successfully.");
  } catch (error) {
    console.error("Failed to update slash commands:", error);
  }
})();

client.on("guildMemberAdd", m => updateStats(m.guild));
client.on("guildMemberRemove", m => updateStats(m.guild));
client.on("channelCreate", ch => ch.guild && updateStats(ch.guild));
client.on("channelDelete", ch => ch.guild && updateStats(ch.guild));

client.once("clientReady", () => {
  try {
    console.log("==========================");
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Servers: ${client.guilds.cache.size}`);
    console.log("==========================");

    client.user.setPresence({
      status: "online",
      activities: [
        {
          name: `${config.prefix}help`,
          type: ActivityType.Watching,
        },
      ],
    });

    const statsFile = "./data/serverstats/serverstats.json";
    if (fs.existsSync(statsFile)) {
      const statsData = JSON.parse(fs.readFileSync(statsFile, "utf8"));
      for (const guildId of Object.keys(statsData)) {
        const guild = client.guilds.cache.get(guildId);
        if (guild) updateStats(guild);
      }
    }

    setInterval(() => {
      client.guilds.cache.forEach(g => updateStats(g));
    }, 10 * 60 * 1000);

  } catch (err) {
    console.error("Error during ready:", err);
  }
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  const lower = message.content.toLowerCase();
  const prefix = config.prefix.toLowerCase();

  if (lower.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const name = args.shift().toLowerCase();
    const cmd = client.commands.get(name);

    if (cmd) {
      try {
        await cmd.execute(message, args, client);
      } catch (e) {
        console.error(e);
        message.reply("There was an error executing that command.");
      }
    }
  }

  if (lower.includes("meow")) {
    const r = ["Meow! 🐱","😺 Meow meow!","Mew~","Purr~ 😻","Nya~ ✨","*eepy meow...* 💤","MEOW!!","🐾 *pounces on you* meow!"];
    return message.channel.send(r[Math.floor(Math.random() * r.length)]);
  }

  const dogWords = ["woof","bark","bork","ruff","arf"];
  if (dogWords.some(w => lower.includes(w))) {
    const r = ["Woof! 🐶","Bark bark!","bork bork!","Ruff~ 🐕","*wags tail excitedly*","🐶 *gives you a slobbery kiss*"];
    return message.channel.send(r[Math.floor(Math.random() * r.length)]);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (e) {
    console.error(e);
    await interaction.reply({ content: "Error executing command.", ephemeral: true });
  }
});

client.on("guildCreate", guild => {
  console.log(`Added to: ${guild.name} (${guild.id})`);
});
client.on("guildDelete", guild => {
  console.log(`Removed from: ${guild.name} (${guild.id})`);
});

client.login(config.token);