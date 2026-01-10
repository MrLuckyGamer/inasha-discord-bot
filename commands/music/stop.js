const { EmbedBuilder } = require('discord.js');
const { musicQueue } = require('../musicQueue');

module.exports = {
    name: 'stop',
    description: 'Stop the music and clear the queue',
    execute(message) {
        const queue = musicQueue.getQueue(message.guild.id);

        if (!queue) {
            return message.reply('❌ There is no music playing!');
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return message.reply('❌ You need to be in the same voice channel as the bot!');
        }

        musicQueue.deleteQueue(message.guild.id);
        
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('⏹️ Stopped')
            .setDescription('Music stopped and queue cleared!')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
