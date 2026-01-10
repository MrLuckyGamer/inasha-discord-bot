const { EmbedBuilder } = require('discord.js');
const { musicQueue } = require('../musicQueue');

module.exports = {
    name: 'remove',
    description: 'Remove a song from the queue',
    execute(message, args) {
        const queue = musicQueue.getQueue(message.guild.id);

        if (!queue || queue.songs.length === 0) {
            return message.reply('❌ There is no music playing!');
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return message.reply('❌ You need to be in the same voice channel as the bot!');
        }

        if (!args.length || isNaN(args[0])) {
            return message.reply('❌ Please provide a valid song position! Example: `i>remove 3`');
        }

        const position = parseInt(args[0]);

        if (position >= queue.songs.length || position < 1) {
            return message.reply(`❌ Invalid position! The queue only has ${queue.songs.length - 1} songs after the current one.`);
        }

        if (position === 0) {
            return message.reply('❌ Cannot remove the currently playing song! Use `i>skip` instead.');
        }

        const removed = queue.songs.splice(position, 1)[0];
        
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('🗑️ Song Removed')
            .setDescription(`Removed: [${removed.title}](${removed.url})`)
            .addFields(
                { name: '📍 Position', value: `#${position}`, inline: true },
                { name: '🎤 Requested by', value: `<@${removed.requestedBy}>`, inline: true }
            )
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
