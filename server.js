
const Discord = require ("discord.js");
const client = new Discord.Client();
const prefix = "y!"
const db = require("quick.db");
const fs = require("fs")
const express = require("express");
const http = require("http");
const app = express();
client.on("ready", () => { //When bot is ready
  console.log("I am Reday to Go")
  client.user.setActivity(db.get(`status`)) //It will set status :)
})
/////////////////////////////////

client.on("message", (message) => {
  
  const config = require("./config.json");
  
	//check if message starts with "/create"
	if(!message.content.startsWith("/create")) return;
	if(!message.member) return;
	var test;
	for(var bundle of config){
		if(bundle.guild == message.guild.id) {
			test = bundle;
			break;
		}
	}

  
  
  
  
	message.guild.createChannel(
		`Talk ${message.member.displayName}`,
		"voice",
		[
			{	//make creator of channel owner (aka gib perms)
				type: "member",
				id: message.member.id,
				allow: 17825808
			},
			{	//hide for everyone temporarily so the channel list doesn't fucking earthquake like a diabetic after downing 3 monsters - this is a permament temporary workaround until D.JS v12 gets released
				type: "role",
				id: message.guild.defaultRole,
				deny: 1024
			}
		],
		(`Created by ${message.member.displayName} via /create command`)
	)
		.catch(error => console.log(error))
		.then(channel=>{
			deleteEmptyChannelAfterDelay(channel);
			channel.setParent(config[0].category)
				.catch(error => console.log(error))
				.finally(function(){	//move channel in voice category
					channel.setPosition(message.guild.channels.get(config[0].category).children.size - config[0].position)
						.catch(error => console.log(error))
						.finally(function(){ //move channel to correct position
							channel.permissionOverwrites.get(message.guild.defaultRole.id).delete()
								.catch(error => console.log(error))
								.then(function(){ //delete overwrite for @everyone (make channel visible again)
									channel.createInvite()
										.catch(error => console.log(error))
										.then((invite) => {
											client.channels.get(" 70169995706918505 ").send(`Created ${channel.name} for ${message.member} - ${invite} <- join link to go into the VC`);
										});
								});
						});
				});
		});

});




//////////////////////////////////////////



///testssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
client.on('guildMemberAdd', async member => {

  const serverstats = new db.table('ServerStats');
  let sguildid = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.guildid' })
  let tusers = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.totusers' })
  let membs = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.membcount' })
  let bots = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.botcount' })
  
	const totalsize = member.guild.memberCount;
	const botsize = member.guild.members.filter(m => m.user.bot).size;
	const humansize = totalsize - botsize;
  
  if(member.guild.id === sguildid) { 
		member.guild.channels.get(tusers).setName("Total Users : " + member.guild.memberCount);
		member.guild.channels.get(membs).setName("Human Users : " + humansize);
		member.guild.channels.get(bots).setName("Bot Users : " + member.guild.members.filter(m => m.user.bot).size);
	}
  });
  
  client.on('guildMemberRemove', async member => {

  const serverstats = new db.table('ServerStats');
  let sguildid = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.guildid' })
  let tusers = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.totusers' })
  let membs = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.membcount' })
  let bots = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.botcount' })
  
	const totalsize = member.guild.memberCount;
	const botsize = member.guild.members.filter(m => m.user.bot).size;
	const humansize = totalsize - botsize;
  
  if(member.guild.id === sguildid) { 
		member.guild.channels.get(tusers).setName("Total Users : " + member.guild.memberCount);
		member.guild.channels.get(membs).setName("Human Users : " + humansize);
		member.guild.channels.get(bots).setName("Bot Users : " + member.guild.members.filter(m => m.user.bot).size);
	}
  });


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

fs.readdir("./commands/", (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js.");
  if (jsfile.length <= 0) {
    console.log("Comanda negasita.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    client.commands.set(props.help.name, props);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0)
      return console.log("Comenzile nu au fost gasite...");
    console.log(`./commands/${f} comenzi...`);
    console.log(`${i + 1}: ${f} incarcate!`);
  });
});

app.get("/", (request, response) => {
  console.log("Bot Online Din Nou!");
  response.sendStatus(200);
});
app.listen(8000);
setInterval(() => {
  http.get(`http://hail-fine-yak.glitch.me`);
}, 280000)

client.on("message", async message => {

  if (!message.content.startsWith(prefix)) return undefined;
  let messageArray = message.content.split(" ");
  let msg = message.content.toLowerCase();
  let command = message.content.toLowerCase().split(" ")[0];
  command = command.slice(prefix.length);
  let args = message.content
    .slice(prefix.length)
    .trim()
    .split(" ");
  let cmd = `${args.shift().toLowerCase()}`;
  try {
    if (command == "h") command = "help";
    let commands = require(`./commands/${cmd}.js`);
    commands.run(client, message, args);
  } catch (e) {
    console.log(e.stack);
  } finally {

    console.log(`${message.author.tag} foloseste comanda \`${cmd}\``)

  }
});

client.on("guildMemberRemove", async member => {
   const fs = require('fs');
  const Jimp = require("jimp")
    let gkanal = JSON.parse(fs.readFileSync("./handle/guild.json", "utf8"));
    const canal = member.guild.channels.get(gkanal[member.guild.id].resim)
    if (!canal) return;
        let username = member.user.username;
        if (canal === undefined || canal === null) return;
        if (canal.type === "text") {            
            const embed = new Discord.RichEmbed()
            .setAuthor(member.user.username, member.user.avatarURL())
            .setColor("#ff2050")
            .setThumbnail(member.user.avatarURL())
            .setDescription(`I will miss you`);
            canal.send(embed);
        }
    })



client.on("guildMemberAdd", async member => {
   const fs = require('fs');
  const Jimp = require("jimp")
    let gkanal = JSON.parse(fs.readFileSync("./handle/guild.json", "utf8"));
    const canal = member.guild.channels.get(gkanal[member.guild.id].resim)
    if (!canal) return;
        let username = member.user.username;
        if (canal === undefined || canal === null) return;
        if (canal.type === "text") {            
            const embed = new Discord.RichEmbed()
    .setAuthor(member.user.username, member.user.avatarURL())
    .setColor("#ff2050")
    .setThumbnail(member.user.avatarURL())
    .setDescription(`We are very happy to have you in our server`);
            canal.send(embed);
            
        }
    })

client.login('NzA5NjY4NDQxNzQ0OTk4NDcy.XrpQTQ.AJNrR9BxKWR3xUmrRoUDoEbPNEM')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
 
 
client.on('guildMemberAdd', member => {
    let channel = member.guild.channels.find('name', '╠【🔯】welcome-bye');
    let memberavatar = member.user.avatarURL
        if (!channel) return;
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(memberavatar)
        .addField(':microphone2: | Welcome!', `Welcome to the server, ${member}`)
        .addField(':id: | User :', "**[" + `${member.id}` + "]**")
        .addField(':family_mwgb: | Your are the member', `${member.guild.memberCount}`)
        .addField('Server', `${member.guild.name}`, true )
        .setFooter(`**${member.guild.name}**`)
        .setTimestamp()
 
        channel.sendEmbed(embed);
});
 
 
 
client.on('guildMemberRemove', member => {
    let channel = member.guild.channels.find('name', '╠【🔯】welcome-bye');
    let memberavatar = member.user.avatarURL
        if (!channel) return;
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(memberavatar)
        .addField('Name:', `${member}`)
        .addField('Has Left the Server', ';(')
        .addField('Bye Bye :(', 'We will all miss you!')
        .addField('The server now as', `${member.guild.memberCount}` + " members")
        .setFooter(`**${member.guild.name}`)
        .setTimestamp()
 
        channel.sendEmbed(embed);
});
 
 client.on('message', message=>{  
    if(message.author.bot) return;  
    if(!message.channel.guild) return;
    if(message.content.startsWith(prefix+'setlog')) {  
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply("Sorry, but you don't have acces to set the logs.");
    let log = message.guild.channels.find("name", "log")  
    if(log) return message.reply("**The channel #log is already exist**")   
    if(!log) {   
    message.guild.createChannel("log", "text").then(c=> {  
        c.overwritePermissions(message.guild.id, {  
            SEND_MESSAGES: false
    })
})
message.channel.send("**? The channel has been created and the channel logs is #logs**")
    }
    }  
     })
client.on('error', console.error);
 
client.on('messageDelete', message => {  
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;  
    if(!message.guild.member(client.user).hasPermission('EMBED_LINKS')) return;  
    if(!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return;  
 
    var logChannel = message.guild.channels.find(c => c.name === 'log');  
    if(!logChannel) return;  
 
    let messageDelete = new Discord.RichEmbed()  
    .setTitle('**[MESSAGE DELETE]**')  
    .setColor('RED')  
    .setThumbnail(message.author.avatarURL)  
    .setDescription(`**\n**:wastebasket: Successfully \`\`DELETE\`\` **MESSAGE** In ${message.channel}\n\n**Channel:** \`\`${message.channel.name}\`\` (ID: ${message.channel.id})\n**Message ID:** ${message.id}\n**Sent By:** <@${message.author.id}> (ID: ${message.author.id})\n**Message:**\n\`\`\`${message}\`\`\``)
    .setTimestamp()  
    .setFooter(message.guild.name, message.guild.iconURL)  
 
    logChannel.send(messageDelete);
});
client.on('messageUpdate', (oldMessage, newMessage) => {  
 
    if(oldMessage.author.bot) return;
    if(!oldMessage.channel.type === 'dm') return;
    if(!oldMessage.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
    if(!oldMessage.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return;
 
    var logChannel = oldMessage.guild.channels.find(c => c.name === 'log');
    if(!logChannel) return;
 
    if(oldMessage.content.startsWith('https://')) return;  
 
    let messageUpdate = new Discord.RichEmbed()
    .setTitle('**[MESSAGE EDIT]**')
    .setThumbnail(oldMessage.author.avatarURL)
    .setColor('BLUE')
    .setDescription(`**\n**:wrench: Successfully \`\`EDIT\`\` **MESSAGE** In ${oldMessage.channel}\n\n**Channel:** \`\`${oldMessage.channel.name}\`\` (ID: ${oldMessage.channel.id})\n**Message ID:** ${oldMessage.id}\n**Sent By:** <@${oldMessage.author.id}> (ID: ${oldMessage.author.id})\n\n**Old Message:**\`\`\`${oldMessage}\`\`\`\n**New Message:**\`\`\`${newMessage}\`\`\``)
    .setTimestamp()
    .setFooter(oldMessage.guild.name, oldMessage.guild.iconURL)
 
    logChannel.send(messageUpdate);
});
 
 

client.on('roleCreate', role => {
 
    if(!role.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
    if(!role.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
 
    var logChannel = role.guild.channels.find(c => c.name === 'log');
    if(!logChannel) return;
 
    role.guild.fetchAuditLogs().then(logs => {
        var userID = logs.entries.first().executor.id;
        var userAvatar = logs.entries.first().executor.avatarURL;
 
        let roleCreate = new Discord.RichEmbed()
        .setTitle('**[ROLE CREATE]**')
        .setThumbnail(userAvatar)  
        .setDescription(`**\n**:white_check_mark: Successfully \`\`CREATE\`\` Role.\n\n**Role Name:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`)
        .setColor('GREEN')
        .setTimestamp()
        .setFooter(role.guild.name, role.guild.iconURL)  
   
        logChannel.send(roleCreate);
    })
});
client.on('roleDelete', role => {  
 
    if(!role.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
    if(!role.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
 
    var logChannel = role.guild.channels.find(c => c.name === 'log');
    if(!logChannel) return;
 
    role.guild.fetchAuditLogs().then(logs => {
        var userID = logs.entries.first().executor.id;
        var userAvatar = logs.entries.first().executor.avatarURL;
 
        let roleDelete = new Discord.RichEmbed()
        .setTitle('**[ROLE DELETE]**')
        .setThumbnail(userAvatar)  
        .setDescription(`**\n**:white_check_mark: Successfully \`\`DELETE\`\` Role.\n\n**Role Name:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`)
        .setColor('RED')
        .setTimestamp()  
        .setFooter(role.guild.name, role.guild.iconURL)
 
        logChannel.send(roleDelete);  
    })
});
client.on('roleUpdate', (oldRole, newRole) => {
 
    if(!oldRole.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
    if(!oldRole.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
 
    var logChannel = oldRole.guild.channels.find(c => c.name === 'log');
    if(!logChannel) return;
   
    oldRole.guild.fetchAuditLogs().then(logs => {
        var userID = logs.entries.first().executor.id;
        var userAvatar = logs.entries.first().executor.avatarURL;
   
        if(oldRole.name !== newRole.name) {
            let roleUpdateName = new Discord.RichEmbed()
            .setTitle('**[ROLE NAME UPDATE]**')  
            .setThumbnail(userAvatar)  
            .setColor('BLUE')
            .setDescription(`**\n**:white_check_mark: Successfully \`\`EDITED\`\` Role Name.\n\n**Old Name:** \`\`${oldRole.name}\`\`\n**New Name:** \`\`${newRole.name}\`\`\n**Role ID:** ${oldRole.id}\n**By:** <@${userID}> (ID: ${userID})`)
            .setTimestamp()
            .setFooter(oldRole.guild.name, oldRole.guild.iconURL)
 
            logChannel.send(roleUpdateName);  
        }
        if(oldRole.hexColor !== newRole.hexColor) {  
            if(oldRole.hexColor === '#000000') {  
                var oldColor = '`Default`';  
            }else {
                var oldColor = oldRole.hexColor;
            }    
            if(newRole.hexColor === '#000000') {  
                var newColor = '`Default`';  
            }else {
                var newColor = newRole.hexColor;  
            }  
            let roleUpdateColor = new Discord.RichEmbed()  
            .setTitle('**[ROLE COLOR UPDATE]**')  
            .setThumbnail(userAvatar)  
            .setColor('BLUE')  
            .setDescription(`**\n**:white_check_mark: Successfully \`\`EDITED\`\` **${oldRole.name}** Role Color.\n\n**Old Color:** ${oldColor}\n**New Color:** ${newColor}\n**Role ID:** ${oldRole.id}\n**By:** <@${userID}> (ID: ${userID})`)
            .setTimestamp()  
            .setFooter(oldRole.guild.name, oldRole.guild.iconURL)
   
            logChannel.send(roleUpdateColor);
        }
        if(oldRole.permissions !== newRole.permissions) {  
            let roleUpdate = new Discord.RichEmbed()  
            .setTitle('**[UPDATE ROLE PERMISSIONS]**')  
            .setThumbnail(userAvatar)  
            .setColor('BLUE')
            .setDescription(`**\n**:first_place: Successfully \`\`CHANGED\`\` **${oldRole.name}** Permissions!\n\n**Old Permissions:** \`\`${oldRole.permissions}\`\`\n**New Permissions:** \`\`${newRole.permissions}\`\`\n**By:** <@${userID}> (ID: ${userID})`)
            .setTimestamp()
            .setFooter(oldRole.guild.name, oldRole.guild.iconURL)
           
            logChannel.send(roleUpdate) 
        }
    })
});
 
 

client.on('channelCreate', channel => { 
  
    if(!channel.guild) return;
    if(!channel.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
    if(!channel.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
 
    var logChannel = channel.guild.channels.find(c => c.name === 'log');
    if(!logChannel) return;
 
    if(channel.type === 'text') {
        var roomType = 'Text';
    }else
    if(channel.type === 'voice') { 
        var roomType = 'Voice';
    }else
    if(channel.type === 'category') { 
        var roomType = 'Category';
    }
 
    channel.guild.fetchAuditLogs().then(logs => { 
        var userID = logs.entries.first().executor.id; 
        var userAvatar = logs.entries.first().executor.avatarURL;
   
        let channelCreate = new Discord.RichEmbed() 
        .setTitle('**[CHANNEL CREATE]**') 
        .setThumbnail(userAvatar)
        .setDescription(`**\n**:white_check_mark: Successfully \`\`CREATE\`\` **${roomType}** channel.\n\n**Channel Name:** \`\`${channel.name}\`\` (ID: ${channel.id})\n**By:** <@${userID}> (ID: ${userID})`)
        .setColor('GREEN')
        .setTimestamp()
        .setFooter(channel.guild.name, channel.guild.iconURL)
 
        logChannel.send(channelCreate);
    })
}); 
client.on('channelDelete', channel => { 
    if(!channel.guild) return;
    if(!channel.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
    if(!channel.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
 
    var logChannel = channel.guild.channels.find(c => c.name === 'log');
    if(!logChannel) return; 
 
    if(channel.type === 'text') { 
        var roomType = 'Text';
    }else
    if(channel.type === 'voice') { 
        var roomType = 'Voice';
    }else
    if(channel.type === 'category') { 
        var roomType = 'Category';
    }
 
    channel.guild.fetchAuditLogs().then(logs => {
        var userID = logs.entries.first().executor.id;
        var userAvatar = logs.entries.first().executor.avatarURL;
 
        let channelDelete = new Discord.RichEmbed()
        .setTitle('**[CHANNEL DELETE]**')
        .setThumbnail(userAvatar) 
        .setDescription(`**\n**:white_check_mark: Successfully \`\`DELETE\`\` **${roomType}** channel.\n\n**Channel Name:** \`\`${channel.name}\`\` (ID: ${channel.id})\n**By:** <@${userID}> (ID: ${userID})`)
        .setColor('RED')
        .setTimestamp()
        .setFooter(channel.guild.name, channel.guild.iconURL)
 
        logChannel.send(channelDelete); 
    })
});
client.on('channelUpdate', (oldChannel, newChannel) => {
    if(!oldChannel.guild) return;
 
    var logChannel = oldChannel.guild.channels.find(c => c.name === 'log');
    if(!logChannel) return;
 
    if(oldChannel.type === 'text') {
        var channelType = 'Text';
    }else
    if(oldChannel.type === 'voice') {
        var channelType = 'Voice';
    }else
    if(oldChannel.type === 'category') {
        var channelType = 'Category';
    }
   
    oldChannel.guild.fetchAuditLogs().then(logs => { 
        var userID = logs.entries.first().executor.id;
        var userAvatar = logs.entries.first().executor.avatarURL;

        if(oldChannel.name !== newChannel.name) {
            let newName = new Discord.RichEmbed()
            .setTitle('**[CHANNEL EDIT]**')
            .setThumbnail(userAvatar)
            .setColor('BLUE')
            .setDescription(`**\n**:wrench: Successfully Edited **${channelType}** Channel Name\n\n**Old Name:** \`\`${oldChannel.name}\`\`\n**New Name:** \`\`${newChannel.name}\`\`\n**Channel ID:** ${oldChannel.id}\n**By:** <@${userID}> (ID: ${userID})`)
            .setTimestamp() 
            .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL) 
 
            logChannel.send(newName); 
        }
        if(oldChannel.topic !== newChannel.topic) { 
            let newTopic = new Discord.RichEmbed() 
            .setTitle('**[CHANNEL EDIT]**') 
            .setThumbnail(userAvatar)
            .setColor('BLUE')
            .setDescription(`**\n**:wrench: Successfully Edited **${channelType}** Channel Topic\n\n**Old Topic:**\n\`\`\`${oldChannel.topic || 'NULL'}\`\`\`\n**New Topic:**\n\`\`\`${newChannel.topic || 'NULL'}\`\`\`\n**Channel:** ${oldChannel} (ID: ${oldChannel.id})\n**By:** <@${userID}> (ID: ${userID})`)
            .setTimestamp()
            .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL)
 
            logChannel.send(newTopic);
        }
    })
});
 
 

client.on('guildBanAdd', (guild, user) => {
 
    if(!guild.member(client.user).hasPermission('EMBED_LINKS')) return;
    if(!guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
 
    var logChannel = guild.channels.find(c => c.name === 'log'); 
    if(!logChannel) return; 
 
    guild.fetchAuditLogs().then(logs => {
        var userID = logs.entries.first().executor.id;
        var userAvatar = logs.entries.first().executor.avatarURL;
 
        if(userID === client.user.id) return;
 
        let banInfo = new Discord.RichEmbed()
        .setTitle('**[BANNED]**')
        .setThumbnail(userAvatar)
        .setColor('DARK_RED')
        .setDescription(`**\n**:airplane: Successfully \`\`BANNED\`\` **${user.username}** From the server!\n\n**User:** <@${user.id}> (ID: ${user.id})\n**By:** <@${userID}> (ID: ${userID})`)
        .setTimestamp()
        .setFooter(guild.name, guild.iconURL)
 
        logChannel.send(banInfo);
    })
});
client.on('guildBanRemove', (guild, user) => {
    if(!guild.member(client.user).hasPermission('EMBED_LINKS')) return; 
    if(!guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
 
    var logChannel = guild.channels.find(c => c.name === 'log'); 
    if(!logChannel) return;
 
    guild.fetchAuditLogs().then(logs => {
        var userID = logs.entries.first().executor.id;
        var userAvatar = logs.entries.first().executor.avatarURL;
 
        let unBanInfo = new Discord.RichEmbed()
        .setTitle('**[UNBANNED]**')
        .setThumbnail(userAvatar)
        .setColor('GREEN')
        .setDescription(`**\n**:unlock: Successfully \`\`UNBANNED\`\` **${user.username}** From the server\n\n**User:** <@${user.id}> (ID: ${user.id})\n**By:** <@${userID}> (ID: ${userID})`)
        .setTimestamp()
        .setFooter(guild.name, guild.iconURL)
 
        logChannel.send(unBanInfo);
    })
});
client.on('guildMemberUpdate', (oldMember, newMember) => { 
    var logChannel = oldMember.guild.channels.find(c => c.name === 'log'); 
    if(!logChannel) return;
 
    oldMember.guild.fetchAuditLogs().then(logs => {
        var userID = logs.entries.first().executor.id; 
        var userAvatar = logs.entries.first().executor.avatarURL;
        var userTag = logs.entries.first().executor.tag;
 
        if(oldMember.nickname !== newMember.nickname) {
            if(oldMember.nickname === null) {
                var oldNM = '\`\`???? ??????\`\`';
            }else {
                var oldNM = oldMember.nickname;
            }
            if(newMember.nickname === null) {
                var newNM = '\`\`???? ??????\`\`'; 
            }else {
                var newNM = newMember.nickname;
            }
 
            let updateNickname = new Discord.RichEmbed()
            .setTitle('**[UPDATE MEMBER NICKNAME]**')
            .setThumbnail(userAvatar)
            .setColor('BLUE')
            .setDescription(`**\n**:spy: Successfully \`\`CHANGE\`\` Member Nickname.\n\n**User:** ${oldMember} (ID: ${oldMember.id})\n**Old Nickname:** ${oldNM}\n**New Nickname:** ${newNM}\n**By:** <@${userID}> (ID: ${userID})`)
            .setTimestamp()
            .setFooter(oldMember.guild.name, oldMember.guild.iconURL)
  
            logChannel.send(updateNickname);
        }
        if(oldMember.roles.size < newMember.roles.size) {
            let role = newMember.roles.filter(r => !oldMember.roles.has(r.id)).first();
 
            let roleAdded = new Discord.RichEmbed()
            .setTitle('**[ADDED ROLE TO MEMBER]**') 
            .setThumbnail(oldMember.guild.iconURL)
            .setColor('GREEN')
            .setDescription(`**\n**:white_check_mark: Successfully \`\`ADDED\`\` Role to **${oldMember.user.username}**\n\n**User:** <@${oldMember.id}> (ID: ${oldMember.user.id})\n**Role:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`)
            .setTimestamp()
            .setFooter(userTag, userAvatar) 
 
            logChannel.send(roleAdded);
        }
        if(oldMember.roles.size > newMember.roles.size) {
            let role = oldMember.roles.filter(r => !newMember.roles.has(r.id)).first();
 
            let roleRemoved = new Discord.RichEmbed()
            .setTitle('**[REMOVED ROLE FROM MEMBER]**')
            .setThumbnail(oldMember.guild.iconURL)
            .setColor('RED')
            .setDescription(`**\n**:negative_squared_cross_mark: Successfully \`\`REMOVED\`\` Role from **${oldMember.user.username}**\n\n**User:** <@${oldMember.user.id}> (ID: ${oldMember.id})\n**Role:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`)
            .setTimestamp()
            .setFooter(userTag, userAvatar) 
 
            logChannel.send(roleRemoved);
        }
    })
    if(oldMember.guild.owner.user.id !== newMember.guild.owner.user.id) {
        let newOwner = new Discord.RichEmbed()
        .setTitle('**[UPDATE GUILD OWNER]**')
        .setThumbnail(oldMember.guild.iconURL)
        .setColor('GREEN')
        .setDescription(`**\n**:white_check_mark: Successfully \`\`TRANSFER\`\` The Owner Ship.\n\n**Old Owner:** <@${oldMember.user.id}> (ID: ${oldMember.user.id})\n**New Owner:** <@${newMember.user.id}> (ID: ${newMember.user.id})`)
        .setTimestamp()
        .setFooter(oldMember.guild.name, oldMember.guild.iconURL)
 
        logChannel.send(newOwner);
    }
});
client.on('guildMemberAdd', member => {
  var logChannel = member.guild.channels.find(c => c.name === 'log'); 
  if(!logChannel) return;
  
  let newMember = new Discord.RichEmbed()
  .setTitle('**[NEW MEMBER JOINED]**') 
  .setThumbnail(member.user.avatarURL)
  .setColor('GREEN')
  .setDescription(`**\n**:arrow_lower_right: **${member.user.username}** Has joined the server!\n\n**User:** <@${member.user.id}> (ID: ${member.user.id})\n**Days In Discord:** ${Days(member.user.createdAt)}`)
  .setTimestamp()
  .setFooter(member.user.tag, member.user.avatarURL)
 
  logChannel.send(newMember);
});
function Days(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
}
client.on('guildMemberRemove', member => { 
  var logChannel = member.guild.channels.find(c => c.name === 'log'); 
  if(!logChannel) return; 
 
  let leaveMember = new Discord.RichEmbed()
  .setTitle('**[USER LEFT]**')
  .setThumbnail(member.user.avatarURL)
  .setColor('GREEN')
  .setDescription(`**\n**:arrow_upper_left: **${member.user.username}** Left the server.\n\n**User:** <@${member.user.id}> (ID: ${member.user.id})`)  
  .setTimestamp() 
  .setFooter(member.user.tag, member.user.avatarURL)
  
  logChannel.send(leaveMember);
});
 
 

client.on('voiceStateUpdate', (voiceOld, voiceNew) => {
 
    if(!voiceOld.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
    if(!voiceOld.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
 
    var logChannel = voiceOld.guild.channels.find(c => c.name === 'log');
    if(!logChannel) return;
 
    voiceOld.guild.fetchAuditLogs().then(logs => {
        var userID = logs.entries.first().executor.id;
        var userTag = logs.entries.first().executor.tag;
        var userAvatar = logs.entries.first().executor.avatarURL;
 

        if(voiceOld.serverMute === false && voiceNew.serverMute === true) {
            let serverMutev = new Discord.RichEmbed()
            .setTitle('**[VOICE MUTE]**')
            .setThumbnail('https://images-ext-1.discordapp.net/external/pWQaw076OHwVIFZyeFoLXvweo0T_fDz6U5C9RBlw_fQ/https/cdn.pg.sa/UosmjqDNgS.png')
            .setColor('RED')
            .setDescription(`**User:** <@${voiceOld.user.id}> (ID: ${voiceOld.user.id})\n**By:** <@${userID}> (ID: ${userID})\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\` (ID: ${voiceOld.voiceChannel.id})`)
            .setTimestamp()
            .setFooter(userTag, userAvatar)
 
            logChannel.send(serverMutev);
        }

        if(voiceOld.serverMute === true && voiceNew.serverMute === false) {
            let serverUnmutev = new Discord.RichEmbed()
            .setTitle('**[VOICE UNMUTE]**')
            .setThumbnail('https://images-ext-1.discordapp.net/external/u2JNOTOc1IVJGEb1uCKRdQHXIj5-r8aHa3tSap6SjqM/https/cdn.pg.sa/Iy4t8H4T7n.png')
            .setColor('GREEN')
            .setDescription(`**User:** <@${voiceOld.user.id}> (ID: ${voiceOld.user.id})\n**By:** <@${userID}> (ID: ${userID})\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\` (ID: ${voiceOld.voiceChannel.id})`)
            .setTimestamp()
            .setFooter(userTag, userAvatar)
 
            logChannel.send(serverUnmutev);
        }

        if(voiceOld.serverDeaf === false && voiceNew.serverDeaf === true) {
            let serverDeafv = new Discord.RichEmbed()
            .setTitle('**[VOICE DEAFEN]**')
            .setThumbnail('https://images-ext-1.discordapp.net/external/7ENt2ldbD-3L3wRoDBhKHb9FfImkjFxYR6DbLYRjhjA/https/cdn.pg.sa/auWd5b95AV.png')
            .setColor('RED')
            .setDescription(`**User:** <@${voiceOld.user.id}> (ID: ${voiceOld.user.id})\n**By:** <@${userID}> (ID: ${userID})\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\` (ID: ${voiceOld.voiceChannel.id})`)
            .setTimestamp()
            .setFooter(userTag, userAvatar)
 
            logChannel.send(serverDeafv);
        }

        if(voiceOld.serverDeaf === true && voiceNew.serverDeaf === false) {
            let serverUndeafv = new Discord.RichEmbed() 
            .setTitle('**[VOICE UNDEAFEN]**')
            .setThumbnail('https://images-ext-2.discordapp.net/external/s_abcfAlNdxl3uYVXnA2evSKBTpU6Ou3oimkejx3fiQ/https/cdn.pg.sa/i7fC8qnbRF.png')
            .setColor('GREEN')
            .setDescription(`**User:** <@${voiceOld.user.id}> (ID: ${voiceOld.user.id})\n**By:** <@${userID}> (ID: ${userID})\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\` (ID: ${voiceOld.voiceChannel.id})`)
            .setTimestamp()
            .setFooter(userTag, userAvatar)
 
            logChannel.send(serverUndeafv); 
        }
    })

    if(voiceOld.voiceChannelID !== voiceNew.voiceChannelID && !voiceOld.voiceChannel) {
        let voiceJoin = new Discord.RichEmbed()
        .setTitle('**[JOIN VOICE ROOM]**')
        .setColor('GREEN')
        .setThumbnail(voiceOld.user.avatarURL)
        .setDescription(`**\n**:arrow_lower_right: Successfully \`\`JOIN\`\` To Voice Channel.\n\n**Channel:** \`\`${voiceNew.voiceChannel.name}\`\` (ID: ${voiceNew.voiceChannelID})\n**User:** ${voiceOld} (ID: ${voiceOld.id})`)
        .setTimestamp()
        .setFooter(voiceOld.user.tag, voiceOld.user.avatarURL)
 
        logChannel.send(voiceJoin);
    }

    if(voiceOld.voiceChannelID !== voiceNew.voiceChannelID && !voiceNew.voiceChannel) {
        let voiceLeave = new Discord.RichEmbed()
        .setTitle('**[LEAVE VOICE ROOM]**')
        .setColor('GREEN')
        .setThumbnail(voiceOld.user.avatarURL)
        .setDescription(`**\n**:arrow_upper_left: Successfully \`\`LEAVE\`\` From Voice Channel.\n\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\` (ID: ${voiceOld.voiceChannelID})\n**User:** ${voiceOld} (ID: ${voiceOld.id})`)
        .setTimestamp()
        .setFooter(voiceOld.user.tag, voiceOld.user.avatarURL)
 
        logChannel.send(voiceLeave); 
    }

    if(voiceOld.voiceChannelID !== voiceNew.voiceChannelID && voiceNew.voiceChannel && voiceOld.voiceChannel != null) {
        let voiceLeave = new Discord.RichEmbed()
        .setTitle('**[CHANGED VOICE ROOM]**')
        .setColor('GREEN')
        .setThumbnail(voiceOld.user.avatarURL)
        .setDescription(`**\n**:repeat: Successfully \`\`CHANGED\`\` The Voice Channel.\n\n**From:** \`\`${voiceOld.voiceChannel.name}\`\` (ID: ${voiceOld.voiceChannelID})\n**To:** \`\`${voiceNew.voiceChannel.name}\`\` (ID: ${voiceNew.voiceChannelID})\n**User:** ${voiceOld} (ID: ${voiceOld.id})`)
        .setTimestamp()
        .setFooter(voiceOld.user.tag, voiceOld.user.avatarURL)
 
        logChannel.send(voiceLeave);
    }  
}); 

  //MUSICCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
  
  const { Client, Util } = require("discord.js");
const { GOOGLE_API_KEY , PREFIX } = require("./confings.js");
const YouTube = require("simple-youtube-api");
const youtube = new YouTube(GOOGLE_API_KEY);
const ytdl = require("ytdl-core")
const queue = new Map();
  
  
  
  
  client.on("message", async msg => {
  if (msg.author.bot) return undefined;
  if (!msg.content.startsWith(PREFIX)) return undefined;

  const args = msg.content.split(" ");
  const searchString = args.slice(1).join(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(msg.guild.id);
  

  let command = msg.content.toLowerCase().split(" ")[0];
  command = command.slice(PREFIX.length);

  if (command === "play") {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel)
      return msg.channel.send(
        "I'm sorry but you need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT")) {
      return msg.channel.send(
        "I cannot connect to your voice channel, make sure I have the proper permissions!"
      );
    }
    if (!permissions.has("SPEAK")) {
      return msg.channel.send(
        "I cannot speak in this voice channel, make sure I have the proper permissions!"
      );
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      var embed = new Discord.RichEmbed()
        .setTitle("Song Selection")
        .setDescription(
          `✅ Playlist: **${playlist.title}** has been added to the queue!`
        )
        .setColor("RANDOM");
      return msg.channel.send(embed);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 10);
          let index = 0;
          var embed = new Discord.RichEmbed()
            .setTitle("🎺 Song Selection ✔️")
            .setDescription(
              `${videos
                .map(video2 => `**${++index}** \`${video2.title}\` `)
                .join("\n")}`
            )
            .setColor("#ff2052")
            .setFooter(
              "Please provide a value to select one of the search results ranging from 1-10."
            );

          msg.channel.send(embed);
          // eslint-disable-next-line max-depth
          try {
            var response = await msg.channel.awaitMessages(
              msg2 => msg2.content > 0 && msg2.content < 11,
              {
                maxMatches: 1,
                time: 10000,
                errors: ["time"]
              }
            );
          } catch (err) {
            console.error(err);
            return msg.channel.send(
              "No or invalid value entered, cancelling video selection."
            );
          }
          const videoIndex = parseInt(response.first().content);
          var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch (err) {
          console.error(err);
          return msg.channel.send("🆘 I could not obtain any search results.");
        }
      }
      return handleVideo(video, msg, voiceChannel);
    }
  } else if (command === "skipppppp") {
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      return msg.reply("YOU DIDENT HAVE ADMINISTRATOR PERMISSIONS!");
    }

    if (!msg.member.voiceChannel)
      return msg.channel.send("You are not in a voice channel!");
    if (!serverQueue)
      return msg.channel.send(
        "There is nothing playing that I could skip for you."
      );
    const embed = new Discord.RichEmbed()
      .setTitle("Song")
      .setColor("#ff2052")
      .setDescription("✅ Successfully skipped the song");
    msg.channel.send(embed);
    
    serverQueue.connection.dispatcher.end("");

    return undefined;
  } else if (command === "stop") {
    if (!msg.member.voiceChannel)
      return msg.channel.send("You are not in a voice channel!");
    if (!serverQueue)
      return msg.channel.send(
        "There is nothing playing that I could stop for you."
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("Stop command has been used!");
    msg.reply("**bot has been stopped !**");
    return undefined;
  } else if (command === "volumeeee") {
    if (!msg.member.voiceChannel)
      return msg.channel.send("You are not in a voice channel!");
    if (!serverQueue) return msg.channel.send("There is nothing playing.");
    if (!args[1])
      return msg.channel.send(
        `The current volume is: **${serverQueue.volume}**`
      );
    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 4);
    return msg.channel.send(`I set the volume to: **${args[1]}**`);
  } else if (command === "np") {
    var embed = new Discord.RichEmbed()
      .setTitle("Song Detail")
      .setDescription(`🎶 \`Now playing:\` **${serverQueue.songs[0].title}**`)
      .setColor("#ff2052");
    if (!serverQueue) return msg.channel.send("There is nothing playing.");
    return msg.channel.send(embed);
  } else if (command === "queue") {
    if (!serverQueue) return msg.channel.send("There is nothing playing.");
    var embed = new Discord.RichEmbed()
      .setTitle("Song Queue")
      .setDescription(
        `${serverQueue.songs.map(song => `**• ** ${song.title}`).join("\n")}

🎵 \`Now playing:\` **${serverQueue.songs[0].title}**`
      )
      .setColor("#ff2052");
    return msg.channel.send(embed);
  } else if (command === "pause") {
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      var embed = new Discord.RichEmbed()
        .setTitle("Song")
        .setDescription(`⏸ Paused the music for you!`)
        .setColor("#ff2052");
      msg.channel.send(embed);
    }
  } else if (command === "resume") {
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      var embed = new Discord.RichEmbed()
        .setTitle("Song")
        .setDescription(`▶ Resumed the music for you!`)
        .setColor("#ff2052");
      msg.channel.send(embed);
    }
  }
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
  const serverQueue = queue.get(msg.guild.id);
  console.log(video);
  const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`
  };
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 10,
      playing: true
    };
    queue.set(msg.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(msg.guild, queueConstruct.songs[0]);
    } catch (error) {
      console.error(`I could not join the voice channel: ${error}`);
      queue.delete(msg.guild.id);
      return msg.channel.send(`I could not join the voice channel: ${error}`);
    }
  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    if (playlist) return undefined;
    var embed = new Discord.RichEmbed()
      .setTitle("Song Selection")
      .setDescription(
        `✅ Playlist: **${playlist.title}** has been added to the queue!`
      )
      .setColor("#ff2052");
    return msg.channel.send(embed);
  }
  return undefined;
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  console.log(serverQueue.songs);

    const dispatcher = serverQueue.connection
    .playStream(ytdl(song.url))
    .on("end", reason => {
      if (reason === "Stream is not generating quickly enough.")
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 10); 
  
  var embed = new Discord.RichEmbed()
    .setTitle("Song Selection")
    .setDescription(`🎵 \`Start playing:\` **${song.title}**`)
    .setColor("#ff2052");
  serverQueue.textChannel.send(embed);
}


  
  //ENDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD

client.login('NzA5NjY4NDQxNzQ0OTk4NDcy.XrpQTQ.AJNrR9BxKWR3xUmrRoUDoEbPNEM')