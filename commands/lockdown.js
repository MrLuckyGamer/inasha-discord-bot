const Discord = require('discord.js');
const ms = require('ms');
const client = new Discord.Client();
module.exports.run = async (bot, message, args) => { 
    if (!client.lockit) { client.lockit = []; }
    let time = args.join(' ');
    let validUnlocks = ['release', 'unlock'];    
    if (!time) { message.channel.send('You must set a duration for the lockdown in either hours, minutes or seconds.'); }

    if (validUnlocks.includes(time)) {
        message.channel.overwritePermissions([
            { id: message.guild.roles.everyone.id, allow: "SEND_MESSAGES" }
        ]).then(() => {
            message.channel.send('**Lockdown lifted.**');
            clearTimeout(client.lockit[message.channel.id]);
            delete client.lockit[message.channel.id];
        }).catch(error => {
            console.log(error);
        });
    } else {
        message.channel.overwritePermissions([
            { id: message.guild.roles.everyone.id, deny: "SEND_MESSAGES" }
        ]).then(() => {
            message.channel.send(`**Channel locked** for ${ms(ms(time), { long:true })}.`).then(() => {
                client.lockit[message.channel.id] = setTimeout(() => {
                    message.channel.overwritePermissions([
                        { id: message.guild.roles.everyone.id, allow: "SEND_MESSAGES" }
                    ]).then(message.channel.send('**Lockdown lifted.**')).catch(console.error);
                    delete client.lockit[message.channel.id];
                }, ms(time));
            }).catch(error => {
                console.log(error);
            });
        });
    }
}

module.exports.help = {
  name:"lockdown",
  aliases: []
}