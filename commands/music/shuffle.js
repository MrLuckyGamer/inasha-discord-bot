const { EmbedBuilder } = require('discord.js');
const { musicQueue } = require('../musicQueue');

module.exports = {
    name: 'shuffle',
    description: 'Shuffle the music queue',
    execute(message) {
        const queue = musicQueue.getQueue(message.guild.id);

        if (!queue) {
            return message.reply('❌ There is no music playing!');
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return message.reply('❌ You need to be in the same voice channel as the bot!');
        }

        if (queue.songs.length <= 2) {
            return message.reply('❌ Not enough songs in the queue to shuffle!');
        }

        // Keep the currently playing song at position 0
        const currentSong = queue.songs[0];
        const remainingSongs = queue.songs.slice(1);
        
        // Fisher-Yates shuffle
        for (let i = remainingSongs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remainingSongs[i], remainingSongs[j]] = [remainingSongs[j], remainingSongs[i]];
        }
        
        queue.songs = [currentSong, ...remainingSongs];
        
        const embed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle('🔀 Queue Shuffled')
            .setDescription(`Shuffled ${remainingSongs.length} songs in the queue!`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
