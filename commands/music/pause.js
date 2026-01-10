const { EmbedBuilder } = require('discord.js');
const { musicQueue } = require('../musicQueue');

module.exports = {
    name: 'pause',
    description: 'Pause the current song',
    execute(message) {
        const queue = musicQueue.getQueue(message.guild.id);

        if (!queue) {
            return message.reply('❌ There is no music playing!');
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return message.reply('❌ You need to be in the same voice channel as the bot!');
        }

        if (queue.player.state.status === 'paused') {
            return message.reply('⏸️ The music is already paused!');
        }

        queue.player.pause();
        
        const embed = new EmbedBuilder()
            .setColor(0xffaa00)
            .setTitle('⏸️ Paused')
            .setDescription('Music paused! Use `pause` to continue.')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
