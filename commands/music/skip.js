const { EmbedBuilder } = require('discord.js');
const { musicQueue } = require('../musicQueue');

module.exports = {
    name: 'skip',
    description: 'Skip the current song',
    execute(message) {
        const queue = musicQueue.getQueue(message.guild.id);

        if (!queue) {
            return message.reply('❌ There is no music playing!');
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return message.reply('❌ You need to be in the same voice channel as the bot!');
        }

        if (queue.songs.length === 1) {
            queue.player.stop();
            return message.reply('⏭️ Skipped! No more songs in queue.');
        }

        queue.player.stop(); // This will trigger the Idle event and play next song
        
        const embed = new EmbedBuilder()
            .setColor(0xffaa00)
            .setTitle('⏭️ Skipped')
            .setDescription('Skipped to the next song!')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
