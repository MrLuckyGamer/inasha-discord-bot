const { EmbedBuilder } = require('discord.js');
const { musicQueue, getSongInfo } = require('../musicQueue');

module.exports = {
    name: 'play',
    description: 'Play a song from YouTube, Spotify, or SoundCloud',
    async execute(message, args) {
        // Check if user is in a voice channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('❌ You need to be in a voice channel to play music!');
        }

        // Check bot permissions
        const permissions = voiceChannel.permissionsFor(message.guild.members.me);
        if (!permissions.has('Connect') || !permissions.has('Speak')) {
            return message.reply('❌ I need permissions to join and speak in your voice channel!');
        }

        if (!args.length) {
            return message.reply('❌ Please provide a song name or URL!');
        }

        const query = args.join(' ');
        const loadingMsg = await message.reply('🔍 Searching...');

        try {
            const songInfo = await getSongInfo(query, message.author.id);

            // Handle playlists
            if (songInfo.type === 'playlist') {
                let queue = musicQueue.getQueue(message.guild.id);
                if (!queue) {
                    queue = musicQueue.createQueue(
                        message.guild.id,
                        voiceChannel,
                        message.channel
                    );
                }

                const playlist = songInfo.data;
                let addedSongs = 0;

                await loadingMsg.edit('📥 Loading playlist...');

                if (playlist.type === 'playlist' || playlist.type === 'album') {
                    const tracks = await playlist.all_tracks();
                    
                    for (const track of tracks) {
                        try {
                            let searchQuery;
                            if (playlist.type === 'album') {
                                searchQuery = `${track.name} ${track.artists[0].name}`;
                            } else {
                                searchQuery = track.url;
                            }
                            
                            const trackInfo = await getSongInfo(searchQuery, message.author.id);
                            if (trackInfo.type !== 'playlist') {
                                queue.songs.push(trackInfo);
                                addedSongs++;
                            }
                        } catch (error) {
                            console.error(`Failed to load track: ${error.message}`);
                        }
                    }
                }

                const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle('📃 Playlist Added')
                    .setDescription(`Added **${addedSongs}** songs to the queue!`)
                    .addFields(
                        { name: '📝 Playlist', value: playlist.name || 'Unknown', inline: true },
                        { name: '🎤 Requested by', value: `${message.author}`, inline: true }
                    )
                    .setTimestamp();

                await loadingMsg.edit({ content: null, embeds: [embed] });

                if (!queue.playing) {
                    musicQueue.playSong(message.guild.id, queue.songs[0]);
                }

                return;
            }

            // Handle single song
            let queue = musicQueue.getQueue(message.guild.id);

            if (!queue) {
                queue = musicQueue.createQueue(
                    message.guild.id,
                    voiceChannel,
                    message.channel
                );
                queue.songs.push(songInfo);
                
                const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle('🎵 Starting Playback')
                    .setDescription(`[${songInfo.title}](${songInfo.url})`)
                    .addFields(
                        { name: '👤 Channel', value: songInfo.author, inline: true },
                        { name: '⏱️ Duration', value: songInfo.duration, inline: true }
                    )
                    .setThumbnail(songInfo.thumbnail)
                    .setTimestamp();

                await loadingMsg.edit({ content: null, embeds: [embed] });
                musicQueue.playSong(message.guild.id, songInfo);
            } else {
                queue.songs.push(songInfo);
                
                const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle('➕ Added to Queue')
                    .setDescription(`[${songInfo.title}](${songInfo.url})`)
                    .addFields(
                        { name: '👤 Channel', value: songInfo.author, inline: true },
                        { name: '⏱️ Duration', value: songInfo.duration, inline: true },
                        { name: '📍 Position', value: `#${queue.songs.length}`, inline: true }
                    )
                    .setThumbnail(songInfo.thumbnail)
                    .setTimestamp();

                await loadingMsg.edit({ content: null, embeds: [embed] });
            }
        } catch (error) {
            console.error('Play command error:', error);
            return loadingMsg.edit('❌ Failed to play the song. Please check the URL or try a different search query.');
        }
    }
};
