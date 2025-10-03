const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require("discord.js");
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
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("guildMemberAdd", member => updateStats(member.guild));
client.on("guildMemberRemove", member => updateStats(member.guild));
client.on("channelCreate", channel => updateStats(channel.guild));
client.on("channelDelete", channel => updateStats(channel.guild));

client.once("clientReady", async () => {
  let totalUsers = 0;
  let totalChannels = 0;

  for (const guild of client.guilds.cache.values()) {
    await guild.members.fetch();

    const members = guild.members.cache;
    totalUsers += members.filter(m => !m.user.bot).size;

    totalChannels += guild.channels.cache.size;
  }

  const guildCount = client.guilds.cache.size;

  console.log("==========================");
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Serving in ${guildCount} servers`);
  console.log(`Watching over ${totalUsers} users`);
  console.log(`Monitoring ${totalChannels} channels`);
  console.log("==========================");

  client.user.setPresence({
    status: 'online', // online, idle, dnd, invisible
    activities: [
      {
        name: `${config.prefix}help`,
        type: 1, // 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching, 4 = Custom
        url: 'https://twitch.tv/femboyyluckyy' // Only needed if type is 1 (Streaming)
      }
    ]
  });

  const statsFile = "./data/serverstats/serverstats.json";
  if (fs.existsSync(statsFile)) {
    const statsData = JSON.parse(fs.readFileSync(statsFile));
    for (const guildId of Object.keys(statsData)) {
      const guild = client.guilds.cache.get(guildId);
      if (guild) await updateStats(guild);
    }
  }

  setInterval(() => {
    client.guilds.cache.forEach(guild => updateStats(guild));
  }, 10 * 60 * 1000);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();
  const prefix = config.prefix.toLowerCase();

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

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().includes("meow")) {
    const responses = [
      "Meow! 🐱",
      "😺 Meow meow!",
      "Mew~",
      "Purr~ 😻",
      "Nya~ ✨",
      "Meeew!",
      "Mrowww 🐈",
      "*eepy meow...* 💤",
      "MEOW!!",
      "UwU nya~",
      "🐾 *pounces on you* meow!",
      "Mrrrp!",
      "Myaa~ 🌸",
      "Mrow? 🐱"
    ];
    message.channel.send(responses[Math.floor(Math.random() * responses.length)]);
  }
});

const TARGET_GUILD_ID = "1179224793078300672";
const bannedWords = ["fuck", "shit", "nigga", "nigger", "fag", "faggot", "bitch", "slut"];

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.guild?.id !== TARGET_GUILD_ID) return;

  const content = message.content.toLowerCase();

  if (bannedWords.some(word => content.includes(word))) {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🚨 Slur Detected!")
      .setDescription(`${message.author} watch your language!`)
      .setImage("https://i.imgur.com/0bkSmUl.png")
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
});

client.on("guildCreate", (guild) => {
  console.log("====================================");
  console.log(`Added to: ${guild.name} (ID: ${guild.id})`);
  console.log(`Members: ${guild.memberCount}`);
  console.log(`Total Servers: ${client.guilds.cache.size}`);
  console.log("====================================");
});

client.on("guildDelete", (guild) => {
  console.log("====================================");
  console.log(`Removed from: ${guild.name} (ID: ${guild.id})`);
  console.log(`Total Servers: ${client.guilds.cache.size}`);
  console.log("====================================");
});

client.login(config.token);