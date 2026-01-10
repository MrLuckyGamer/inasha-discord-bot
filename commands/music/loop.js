const { EmbedBuilder } = require('discord.js');
const { musicQueue } = require('../musicQueue');

module.exports = {
    name: 'loop',
    description: 'Toggle loop mode for the current song',
    execute(message) {
        const queue = musicQueue.getQueue(message.guild.id);

        if (!queue) {
            return message.reply('❌ There is no music playing!');
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return message.reply('❌ You need to be in the same voice channel as the bot!');
        }

        queue.loop = !queue.loop;
        if (queue.loop) {
            queue.loopQueue = false; // Disable queue loop if song loop is enabled
        }
        
        const embed = new EmbedBuilder()
            .setColor(queue.loop ? 0x00ff00 : 0xff0000)
            .setTitle(queue.loop ? '🔁 Loop Enabled' : '🔁 Loop Disabled')
            .setDescription(queue.loop ? 'Current song will repeat!' : 'Loop mode disabled.')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
