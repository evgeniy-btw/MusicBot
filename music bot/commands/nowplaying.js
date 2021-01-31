const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "nowplaying",
    description: "Посмотреть какая музыка сейчас играет.",
    usage: "",
    aliases: ["np"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Сейчас на сервере не играет музыка.", message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Сейчас играет", "https://media.discordapp.net/attachments/749638503683326004/783276139963351040/ebeb0045f7c5948c.png?width=675&height=675")
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("Название", song.title, true)
      .addField("Продолжительность", song.duration, true)
      .addField("По просьбе", song.req.tag, true)
      .setFooter(`Просмотры: ${song.views} | ${song.ago}`)
    return message.channel.send(thing)
  },
};
