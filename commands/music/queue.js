const { EmbedBuilder } = require('discord.js');
const { musicQueue } = require('../musicQueue');

module.exports = {
    name: 'queue',
    description: 'View the current music queue',
    execute(message, args) {
        const queue = musicQueue.getQueue(message.guild.id);

        if (!queue || queue.songs.length === 0) {
            return message.reply('❌ The queue is empty!');
        }

        const page = parseInt(args[0]) || 1;
        const songsPerPage = 10;
        const start = (page - 1) * songsPerPage;
        const end = start + songsPerPage;
        const totalPages = Math.ceil(queue.songs.length / songsPerPage);

        if (page > totalPages) {
            return message.reply(`❌ Invalid page! There are only ${totalPages} pages.`);
        }

        const queueList = queue.songs
            .slice(start, end)
            .map((song, index) => {
                const position = start + index;
                const indicator = position === 0 ? '🎵' : `${position + 1}.`;
                return `${indicator} [${song.title}](${song.url}) - \`${song.duration}\` | <@${song.requestedBy}>`;
            })
            .join('\n');

        const nowPlaying = queue.songs[0];
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('🎵 Music Queue')
            .setDescription(queueList || 'No songs in queue')
            .addFields(
                { name: 'Now Playing', value: `[${nowPlaying.title}](${nowPlaying.url})`, inline: false },
                { name: '📊 Queue Info', value: `${queue.songs.length} song(s) | Page ${page}/${totalPages}`, inline: true },
                { name: '🔁 Loop', value: queue.loop ? '✅ On' : '❌ Off', inline: true },
                { name: '🔂 Loop Queue', value: queue.loopQueue ? '✅ On' : '❌ Off', inline: true }
            )
            .setThumbnail(nowPlaying.thumbnail)
            .setTimestamp()
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        return message.reply({ embeds: [embed] });
    }
};
