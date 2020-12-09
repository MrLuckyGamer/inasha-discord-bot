const Discord = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true });
let Database = require('./db.js')
const YouTube = require("simple-youtube-api");

bot.fs = require("fs");
bot.config = require("./config.json");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.db = new Database(bot);
bot.db.load();
bot.logging = require('./callbacks/logging.js')
bot.logging.process(bot);
bot.youtube = new YouTube(bot.config.yt_token);
bot.ytdl = require("ytdl-core")
bot.queue = new Map();

bot.fs.readdir("./commands/", (err, files) => {
  if(err) { console.log(err); }
  let jsfile = files.filter(f => f.split(".").pop() === "js");

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    bot.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => { 
      bot.aliases.set(alias, props.help.name);
    });
  });
})

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);
  bot.user.setPresence({status: 'online', activity:{ name: `on ${bot.guilds.cache.size} Servers! │ i>help`, type: 0}});
})

bot.on("message", async message => {
  if (!message.content.startsWith(bot.config.prefix)) { return undefined; }
  let command = message.content.toLowerCase().split(" ")[0];
  command = command.slice(bot.config.prefix.length);
  let args = message.content
  .slice(bot.config.prefix.length + command.length)
  .trim()
  .split(" ");

  if(bot.commands.has(command)) {
    bot.commands.get(command).run(bot, message, args);
  } else if(bot.aliases.has(command) && bot.commands.has(bot.aliases.get(command))) {
    bot.commands.get(bot.aliases.get(command)).run(bot, message, args);
  } else {
    message.channel.send("Unknown Command | i>help");
  }
});

bot.login(bot.config.token)