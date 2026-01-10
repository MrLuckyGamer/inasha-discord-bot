const { EmbedBuilder } = require('discord.js');
const { musicQueue } = require('../musicQueue');

module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Show the currently playing song',
    execute(message) {
        const queue = musicQueue.getQueue(message.guild.id);

        if (!queue || queue.songs.length === 0) {
            return message.reply('❌ There is no music playing!');
        }

        const song = queue.songs[0];
        
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('🎵 Now Playing')
            .setDescription(`[${song.title}](${song.url})`)
            .addFields(
                { name: '👤 Channel', value: song.author, inline: true },
                { name: '⏱️ Duration', value: song.duration, inline: true },
                { name: '🎤 Requested by', value: `<@${song.requestedBy}>`, inline: true },
                { name: '📊 Status', value: queue.player.state.status === 'paused' ? '⏸️ Paused' : '▶️ Playing', inline: true },
                { name: '🔁 Loop', value: queue.loop ? '✅ On' : '❌ Off', inline: true },
                { name: '🔂 Loop Queue', value: queue.loopQueue ? '✅ On' : '❌ Off', inline: true }
            )
            .setThumbnail(song.thumbnail)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
