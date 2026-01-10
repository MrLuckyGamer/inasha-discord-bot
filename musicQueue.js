const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState
} = require('@discordjs/voice');
const play = require('play-dl');
const { EmbedBuilder } = require('discord.js');

class MusicQueue {
    constructor() {
        this.queues = new Map(); // guildId -> queue data
    }

    getQueue(guildId) {
        return this.queues.get(guildId);
    }

    createQueue(guildId, voiceChannel, textChannel) {
        const player = createAudioPlayer();
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const queue = {
            voiceChannel,
            textChannel,
            connection,
            player,
            songs: [],
            volume: 1,
            playing: false,
            loop: false,
            loopQueue: false,
        };

        connection.subscribe(player);
        this.setupPlayerEvents(guildId, player, queue);
        this.queues.set(guildId, queue);
        
        return queue;
    }

    setupPlayerEvents(guildId, player, queue) {
        player.on(AudioPlayerStatus.Idle, () => {
            if (queue.loop && queue.songs.length > 0) {
                // Loop current song
                this.playSong(guildId, queue.songs[0]);
            } else if (queue.loopQueue && queue.songs.length > 0) {
                // Move to next song and add current to end
                const current = queue.songs.shift();
                queue.songs.push(current);
                if (queue.songs.length > 0) {
                    this.playSong(guildId, queue.songs[0]);
                }
            } else {
                // Normal behavior - play next song
                queue.songs.shift();
                if (queue.songs.length > 0) {
                    this.playSong(guildId, queue.songs[0]);
                } else {
                    queue.playing = false;
                    queue.textChannel.send('🎵 Queue finished! Use `i>play` to add more songs.');
                    setTimeout(() => {
                        if (this.queues.get(guildId)?.songs.length === 0) {
                            this.deleteQueue(guildId);
                        }
                    }, 300000); // 5 minutes
                }
            }
        });

        player.on('error', error => {
            console.error('Audio player error:', error);
            queue.textChannel.send('❌ An error occurred while playing the song.');
            queue.songs.shift();
            if (queue.songs.length > 0) {
                this.playSong(guildId, queue.songs[0]);
            }
        });
    }

    async playSong(guildId, song) {
        const queue = this.getQueue(guildId);
        if (!queue) return;

        try {
            const stream = await play.stream(song.url);
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type,
            });

            queue.player.play(resource);
            queue.playing = true;

            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('🎵 Now Playing')
                .setDescription(`[${song.title}](${song.url})`)
                .addFields(
                    { name: '👤 Channel', value: song.author, inline: true },
                    { name: '⏱️ Duration', value: song.duration, inline: true },
                    { name: '🎤 Requested by', value: `<@${song.requestedBy}>`, inline: true }
                )
                .setThumbnail(song.thumbnail)
                .setTimestamp();

            queue.textChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error playing song:', error);
            queue.textChannel.send('❌ Failed to play this song. Skipping...');
            queue.songs.shift();
            if (queue.songs.length > 0) {
                this.playSong(guildId, queue.songs[0]);
            }
        }
    }

    deleteQueue(guildId) {
        const queue = this.getQueue(guildId);
        if (!queue) return;

        try {
            queue.player.stop();
            queue.connection.destroy();
        } catch (error) {
            console.error('Error destroying connection:', error);
        }

        this.queues.delete(guildId);
    }
}

const musicQueue = new MusicQueue();

// Helper function to format duration
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Helper function to search and get song info
async function getSongInfo(query, requestedBy) {
    try {
        // Check if it's a URL
        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            const info = await play.video_info(query);
            return {
                title: info.video_details.title,
                url: info.video_details.url,
                duration: formatDuration(info.video_details.durationInSec),
                thumbnail: info.video_details.thumbnails[0].url,
                author: info.video_details.channel.name,
                requestedBy
            };
        } else if (query.includes('spotify.com')) {
            // For Spotify, we need to search on YouTube
            const spotifyInfo = await play.spotify(query);
            
            if (spotifyInfo.type === 'track') {
                const searchResult = await play.search(`${spotifyInfo.name} ${spotifyInfo.artists[0].name}`, { limit: 1 });
                if (searchResult.length === 0) throw new Error('No results found');
                
                return {
                    title: spotifyInfo.name,
                    url: searchResult[0].url,
                    duration: formatDuration(searchResult[0].durationInSec),
                    thumbnail: spotifyInfo.thumbnail?.url || searchResult[0].thumbnails[0].url,
                    author: spotifyInfo.artists[0].name,
                    requestedBy
                };
            } else if (spotifyInfo.type === 'playlist' || spotifyInfo.type === 'album') {
                // Return playlist info to be handled separately
                return { type: 'playlist', data: spotifyInfo, requestedBy };
            }
        } else if (query.includes('soundcloud.com')) {
            const info = await play.soundcloud(query);
            
            if (info.type === 'track') {
                return {
                    title: info.name,
                    url: info.url,
                    duration: formatDuration(info.durationInSec),
                    thumbnail: info.thumbnail,
                    author: info.user.name,
                    requestedBy
                };
            } else if (info.type === 'playlist') {
                return { type: 'playlist', data: info, requestedBy };
            }
        } else {
            // Search YouTube
            const searchResult = await play.search(query, { limit: 1 });
            if (searchResult.length === 0) throw new Error('No results found');
            
            return {
                title: searchResult[0].title,
                url: searchResult[0].url,
                duration: formatDuration(searchResult[0].durationInSec),
                thumbnail: searchResult[0].thumbnails[0].url,
                author: searchResult[0].channel.name,
                requestedBy
            };
        }
    } catch (error) {
        console.error('Error getting song info:', error);
        throw error;
    }
}

module.exports = {
    musicQueue,
    getSongInfo,
    formatDuration
};