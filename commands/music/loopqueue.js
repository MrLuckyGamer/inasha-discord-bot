const { EmbedBuilder } = require('discord.js');
const { musicQueue } = require('../musicQueue');

module.exports = {
    name: 'loopqueue',
    description: 'Toggle loop mode for the entire queue',
    execute(message) {
        const queue = musicQueue.getQueue(message.guild.id);

        if (!queue) {
            return message.reply('❌ There is no music playing!');
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return message.reply('❌ You need to be in the same voice channel as the bot!');
        }

        queue.loopQueue = !queue.loopQueue;
        if (queue.loopQueue) {
            queue.loop = false; // Disable song loop if queue loop is enabled
        }
        
        const embed = new EmbedBuilder()
            .setColor(queue.loopQueue ? 0x00ff00 : 0xff0000)
            .setTitle(queue.loopQueue ? '🔂 Queue Loop Enabled' : '🔂 Queue Loop Disabled')
            .setDescription(queue.loopQueue ? 'The entire queue will repeat!' : 'Queue loop disabled.')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
