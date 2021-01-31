const {
	Util,
	MessageEmbed
} = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
const scrapeYt = require("scrape-yt");
const sendError = require("../util/error")
const fs = require('fs');

module.exports = {
	info: {
		name: "playlist",
		description: "Включить Плейлист YouTube.",
		usage: "<YouTube Плейлист URL | Название Плейлиста>",
		aliases: ["pl"],
	},

	run: async function (client, message, args) {
		const channel = message.member.voice.channel;
		if (!channel) return sendError("Мне очень жаль но вам нужно быть в голосовом канале чтобы играть музыку!", message.channel);
		const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
		var searchString = args.join(" ");
		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has("CONNECT")) return sendError("Я не могу подключиться к вашему голосовому каналу, убедитесь, что у меня есть соответствующие разрешения!", message.channel);
		if (!permissions.has("SPEAK")) return sendError("Я не могу говорить в этом голосовом канале, убедитесь, что у меня есть соответствующие разрешения!", message.channel);

		if (!searchString||!url) return sendError(`Использование: ${message.client.config.prefix}playlist <YouTube Плейлист URL | Название Плейлиста>`, message.channel);
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			try {
				const playlist = await scrapeYt.getPlaylist(url.split("list=")[1]);
				if (!playlist) return sendError("Плейлист не найден", message.channel)
				const videos = await playlist.videos;
				for (const video of videos) {
					
					await handleVideo(video, message, channel, true); 
				}
				return message.channel.send({
					embed: {
						color: "GREEN",
						description: `✅  **|**  Плейлист: **\`${videos[0].title}\`** добавлен в очередь`
					}
				})
			} catch (error) {
				console.error(error);
				return sendError("Плейлист не найден :(",message.channel).catch(console.error);
			}
		} else {
			try {
				var searched = await yts.search(searchString)

				if (searched.playlists.length === 0) return sendError("Похоже, я не смог найти плейлист на YouTube", message.channel)
				var songInfo = searched.playlists[0];
				let listurl = songInfo.listId;
				const playlist = await scrapeYt.getPlaylist(listurl)
				const videos = await playlist.videos;
				for (const video of videos) {
					
					await handleVideo(video, message, channel, true); 
				}
				let thing = new MessageEmbed()
					.setAuthor("Плейлист был добавлен в очередь", "https://media.discordapp.net/attachments/749638503683326004/783276139963351040/ebeb0045f7c5948c.png?width=675&height=675")
					.setThumbnail(songInfo.thumbnail)
					.setColor("GREEN")
					.setDescription(`✅  **|**  Плейлист: **\`${songInfo.title}\`** был добавлен \`${songInfo.videoCount}\` в очередь`)
				return message.channel.send(thing)
			} catch (error) {
				return sendError("Произошла непредвиденная ошибка",message.channel).catch(console.error);
			}
		}

		async function handleVideo(video, message, channel, playlist = false) {
			const serverQueue = message.client.queue.get(message.guild.id);
			const song = {
				id: video.id,
				title: Util.escapeMarkdown(video.title),
				views: video.views ? video.views : "-",
				ago: video.ago ? video.ago : "-",
                                duration: video.duration,
				url: `https://www.youtube.com/watch?v=${video.id}`,
				img: video.thumbnail.url,
				req: message.author
			};
			if (!serverQueue) {
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

				try {
					var connection = await channel.join();
					queueConstruct.connection = connection;
					play(message.guild, queueConstruct.songs[0]);
				} catch (error) {
					console.error(`Я не мог подключиться к голосовому каналу: ${error}`);
					message.client.queue.delete(message.guild.id);
					return sendError(`Я не мог подключиться к голосовому каналу: ${error}`, message.channel);

				}
			} else {
				serverQueue.songs.push(song);
				if (playlist) return;
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
			return;
		}

async	function play(guild, song) {
			const serverQueue = message.client.queue.get(message.guild.id);
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
        if (serverQueue) {
        serverQueue.songs.shift();
        play(serverQueue.songs[0]);
      }
      
  	 sendError(`Произошла непредвиденная ошибка.\n Тип \`${err}\``, message.channel)
     return;
});
    }
      serverQueue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
			const dispatcher = serverQueue.connection
         .play(ytdl(song.url, {quality: 'highestaudio', highWaterMark: 1 << 25 ,type: "opus"}))
        .on("finish", () => {
            const shiffed = serverQueue.songs.shift();
            if (serverQueue.loop === true) {
                serverQueue.songs.push(shiffed);
            };
            play(guild, serverQueue.songs[0]);
        })

    dispatcher.setVolume(serverQueue.volume / 100);
let thing = new MessageEmbed()
				.setAuthor("Started Playing Music!", "https://media.discordapp.net/attachments/749638503683326004/783276139963351040/ebeb0045f7c5948c.png?width=675&height=675")
				.setThumbnail(song.img)
				.setColor("BLUE")
				.addField("Название", song.title, true)
				.addField("Продолжительность", song.duration, true)
				.addField("По просьбе", song.req.tag, true)
				.setFooter(`Просмотры: ${song.views} | ${song.ago}`)
    serverQueue.textChannel.send(thing);
}


	},



};
