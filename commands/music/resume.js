const { EmbedBuilder } = require('discord.js');
const { musicQueue } = require('../musicQueue');

module.exports = {
    name: 'resume',
    description: 'Resume the paused song',
    execute(message) {
        const queue = musicQueue.getQueue(message.guild.id);

        if (!queue) {
            return message.reply('❌ There is no music playing!');
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return message.reply('❌ You need to be in the same voice channel as the bot!');
        }

        if (queue.player.state.status !== 'paused') {
            return message.reply('▶️ The music is not paused!');
        }

        queue.player.unpause();
        
        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('▶️ Resumed')
            .setDescription('Music resumed!')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
