const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
const YouTube = require("youtube-sr");
const sendError = require("../util/error")
const fs = require('fs');

module.exports = {
  info: {
    name: "search",
    description: "Искать песню на YouTube.",
    usage: "<Название Песни>",
    aliases: ["sc"],
  },

  run: async function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel)return sendError("Мне очень жаль, но вам нужно быть в голосовом канале, чтобы играть музыку!", message.channel);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))return sendError("Я не могу подключиться к вашему голосовому каналу, убедитесь, что у меня есть соответствующие разрешения!", message.channel);
    if (!permissions.has("SPEAK"))return sendError("Я не могу подключиться к вашему голосовому каналу, убедитесь, что у меня есть соответствующие разрешения", message.channel);

    var searchString = args.join(" ");
    if (!searchString)return sendError("Вы не предоставили права, я хочу искать", message.channel);

    var serverQueue = message.client.queue.get(message.guild.id);
    try {
           var searched = await YouTube.search(searchString, { limit: 10 });
          if (searched[0] == undefined)return sendError("Похоже, я не смог найти эту песню на YouTube", message.channel);
                    let index = 0;
                    let embedPlay = new MessageEmbed()
                        .setColor("BLUE")
                        .setAuthor(`Результаты для \"${args.join(" ")}\"`, message.author.displayAvatarURL())
                        .setDescription(`${searched.map(video2 => `**\`${++index}\`  |** [\`${video2.title}\`](${video2.url}) - \`${video2.durationFormatted}\``).join("\n")}`)
                        .setFooter("Введите номер песни, чтобы добавить ее в список воспроизведения");
                    
                    message.channel.send(embedPlay).then(m => m.delete({
                        timeout: 15000
                    }))
                    try {
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                            max: 1,
                            time: 20000,
                            errors: ["time"]
                        });
                    } catch (err) {
                        console.error(err);
                        return message.channel.send({
                            embed: {
                                color: "RED",
                                description: "В течение 20 секунд ничего не было выбрано, запрос был отменен."
                            }
                        });
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await (searched[videoIndex - 1])
		    
                } catch (err) {
                    console.error(err);
                    return message.channel.send({
                        embed: {
                            color: "RED",
                            description: "🆘  **|**  Я не смог получить никаких результатов поиска"
                        }
                    });
                }
            
            response.delete();
  var songInfo = video

    const song = {
      id: songInfo.id,
      title: Util.escapeMarkdown(songInfo.title),
      views: String(songInfo.views).padStart(10, ' '),
      ago: songInfo.uploadedAt,
      duration: songInfo.durationFormatted,
      url: `https://www.youtube.com/watch?v=${songInfo.id}`,
      img: songInfo.thumbnail.url,
      req: message.author
    };

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
        sendError("Покидаю голосовой канал, потому что мне кажется, что в очереди нет песен. Если вам нравится бот оставайтесь 24/7 в голосовом канале, команда `!afk`)", message.channel)
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
      
  	 sendError(`Произошла непредвиденная ошибка.\n Возможный тип \`${err}\``, message.channel)
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
          play(queue.songs[0]);
        })

      dispatcher.setVolumeLogarithmic(queue.volume / 100);
      let thing = new MessageEmbed()
      .setAuthor("Начинаю играть музыку!", "https://media.discordapp.net/attachments/749638503683326004/783276139963351040/ebeb0045f7c5948c.png?width=675&height=675")
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
      channel.guild.voice.setSelfDeaf(true)
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Я не мог подключиться к голосовому каналу: ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return sendError(`Я не мог подключиться к голосовому каналу: ${error}`, message.channel);
    }
 
  },

};
