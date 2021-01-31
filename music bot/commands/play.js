const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const ytdlDiscord = require("ytdl-core-discord");
const yts = require("yt-search");
const fs = require('fs');
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "play",
    description: "Включить музыку.",
    usage: "<YouTube_URL> | <Название песни>",
    aliases: ["p"],
  },

  run: async function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel)return sendError("Мне очень жаль но вам нужно быть в голосовом канале чтобы играть музыку!", message.channel);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))return sendError("Я не могу подключиться к вашему голосовому каналу, убедитесь, что у меня есть соответствующие разрешения!", message.channel);
    if (!permissions.has("SPEAK"))return sendError("Я не могу говорить в этом голосовом канале, убедитесь, что у меня есть соответствующие разрешения!", message.channel);

    var searchString = args.join(" ");
    if (!searchString)return sendError("Ты не ввёл название песни / ссылку...", message.channel);
   	const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
   var serverQueue = message.client.queue.get(message.guild.id);

     let songInfo = null;
    let song = null;
    if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
       try {
          songInfo = await ytdl.getInfo(url)
          if(!songInfo)return sendError("Похоже, я не смог найти эту песню на YouTube", message.channel);
        song = {
       id: songInfo.videoDetails.videoId,
       title: songInfo.videoDetails.title,
       url: songInfo.videoDetails.video_url,
       img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
      duration: songInfo.videoDetails.lengthSeconds,
      ago: songInfo.videoDetails.publishDate,
      views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
      req: message.author

        };

      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }else {
      try {
        var searched = await yts.search(searchString);
    if(searched.videos.length === 0)return sendError("Похоже, я не смог найти эту песню на YouTube", message.channel)
    
     songInfo = searched.videos[0]
        song = {
      id: songInfo.videoId,
      title: Util.escapeMarkdown(songInfo.title),
      views: String(songInfo.views).padStart(10, ' '),
      url: songInfo.url,
      ago: songInfo.ago,
      duration: songInfo.duration.toString(),
      img: songInfo.image,
      req: message.author
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      let thing = new MessageEmbed()
      .setAuthor("Песня была добавлена в очередь", "https://media.discordapp.net/attachments/749638503683326004/783276139963351040/ebeb0045f7c5948c.png?width=675&height=675")
      .setThumbnail(song.img)
      .setColor("YELLOW")
      .addField("Название", song.title, true)
      .addField("Продолжительность", song.duration, true)
      .addField("По просьбе", song.req.tag, true)
      .setFooter(`Просмотры: ${song.views} | ${song.ago}`)
      return message.channel.send(thing);
    }

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 80,
      playing: true,
      loop: false
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const play = async (song) => {
      const queue = message.client.queue.get(message.guild.id);
    let afk = JSON.parse(fs.readFileSync("./afk.json", "utf8"));
       if (!afk[message.guild.id]) afk[message.guild.id] = {
        afk: false,
    };
    var online = afk[message.guild.id]
    if (!song){
      if (!online.afk) {
        sendError("Покидаю голосовой канал, потому что мне кажется, что в очереди нет песен. Если вам нравится бот оставайтесь 24/7 в голосовом канале, команада `afk`)", message.channel)
        message.guild.me.voice.channel.leave();
        message.client.queue.delete(message.guild.id);
      }
            return message.client.queue.delete(message.guild.id);
}
  let stream = null;  
    if (song.url.includes("youtube.com")) {
      stream = await ytdl(song.url);
      stream.on('error', err => {
        if (queue) {
        queue.songs.shift();
        play(queue.songs[0]);
      }
      
  	 sendError(`Произошла непредвиденная ошибка.\nPossible type \`${err}\``, message.channel)
     return;
});
    }
    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

      const dispatcher = queue.connection
         .play(ytdl(song.url, {quality: 'highestaudio', highWaterMark: 1 << 25 ,type: "opus"}))
         .on("finish", () => {
           const shiffed = queue.songs.shift();
            if (queue.loop === true) {
                queue.songs.push(shiffed);
            };
          play(queue.songs[0])
        })

      dispatcher.setVolumeLogarithmic(queue.volume / 100);
      let thing = new MessageEmbed()
      .setAuthor("Started Playing Music!", "https://media.discordapp.net/attachments/749638503683326004/783276139963351040/ebeb0045f7c5948c.png?width=675&height=675")
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("Название", song.title, true)
      .addField("Продолжительность", song.duration, true)
      .addField("По просьбе", song.req.tag, true)
      .setFooter(`Просмотры: ${song.views} | ${song.ago}`)
      queue.textChannel.send(thing);
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Я не мог подключиться к голосовому каналу: ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return sendError(`Я не мог подключиться к голосовому каналу: ${error}`, message.channel);
    }
  


},

};
