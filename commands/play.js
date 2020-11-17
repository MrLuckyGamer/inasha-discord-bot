const Discord = require("discord.js");

module.exports.run = async(bot, msg, args) => {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel)
      return msg.channel.send(
        "I'm sorry but you need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT")) {
      return msg.channel.send(
        "I cannot connect to your voice channel, make sure I have the proper permissions!"
      );
    }
    if (!permissions.has("SPEAK")) {
      return msg.channel.send(
        "I cannot speak in this voice channel, make sure I have the proper permissions!"
      );
    }

    if (args.join(" ").match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await bot.youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await bot.youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(bot, video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }

      var embed = new Discord.MessageEmbed()
      .setTitle("Song Selection")
      .setDescription(
        `✅ Playlist: **${playlist.title}** has been added to the queue!`
      )
      .setColor("RANDOM");

      return msg.channel.send(embed);
    } else {
      try {
        var video = await bot.youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await bot.youtube.searchVideos(args.join(" "), 10);
          let index = 0;
          var embed = new Discord.MessageEmbed()
            .setTitle("🎺 Song Selection ✔️")
            .setDescription(
              `${videos
                .map(video2 => `**${++index}** \`${video2.title}\` `)
                .join("\n")}`
            )
            .setColor("#ff2052")
            .setFooter(
              "Please provide a value to select one of the search results ranging from 1-10."
            );

          msg.channel.send(embed);
          // eslint-disable-next-line max-depth
          try {
            var response = await msg.channel.awaitMessages(
              msg2 => { return parseInt(msg2.content) > 0 && parseInt(msg2.content) < 11; },
              { max: 1 }
            );
          } catch (err) {
            console.error(err);
            return msg.channel.send(
              "No or invalid value entered, cancelling video selection."
            );
          }
          const videoIndex = parseInt(response.first().content);
          var video = await bot.youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch (err) {
          console.error(err);
          return msg.channel.send("🆘 I could not obtain any search results.");
        }
      }
      return handleVideo(bot, video, msg, voiceChannel);
    }
}

async function handleVideo(bot, video, msg, voiceChannel, playlist = false) {
    const serverQueue = bot.queue.get(msg.guild.id);

    const song = {
      id: video.id,
      title: video.title,
      url: `https://www.youtube.com/watch?v=${video.id}`
    };
  
    if (!serverQueue) {
      const queueConstruct = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 10,
        playing: true
      };
      bot.queue.set(msg.guild.id, queueConstruct);
  
      queueConstruct.songs.push(song);
  
      try {
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(bot, msg.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.error(`I could not join the voice channel: ${error.stack}`);
        bot.queue.delete(msg.guild.id);
        return msg.channel.send(`I could not join the voice channel: ${error.stack}`);
      }
    } else {
      serverQueue.songs.push(song);
      if (playlist) { return undefined; }
      var embed = new Discord.MessageEmbed()
      .setTitle("Song Selection")
      .setDescription(
        `✅ Playlist: **${playlist.title}** has been added to the queue!`
      )
      .setColor("#ff2052");
      return msg.channel.send(embed);
    }
  
    return undefined;
}

function play(bot, guild, song) {
    const serverQueue = bot.queue.get(guild.id);
  
    if (!song) {
      serverQueue.voiceChannel.leave();
      bot.queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection
    .play(bot.ytdl(song.url))
    .on("end", () => {
      serverQueue.songs.shift();
      play(bot, guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 10); 
    
    var embed = new Discord.MessageEmbed()
    .setTitle("Song Selection")
    .setDescription(`🎵 \`Start playing:\` **${song.title}**`)
    .setColor("#ff2052");
  
    serverQueue.textChannel.send(embed);
}

module.exports.help = {
    name:"play",
    aliases: []
}