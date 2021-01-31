const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "volume",
    description: "Изменяет громкость бота на сервере.",
    usage: "",
    aliases: ["v", "vol"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("Мне очень жаль но вам нужно быть в голосовом канале чтобы играть музыку!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("На этом сервере ничего не играет.", message.channel);
    if (!args[0])return message.channel.send(`Текущий объем составляет: **${serverQueue.volume}**`);
     if(isNaN(args[0])) return message.channel.send(':notes: Только цифры!').catch(err => console.log(err));
    if(parseInt(args[0]) > 150 ||(args[0]) < 0) return sendError('Вы не можете установить громкость больше 150 или ниже 0',message.channel).catch(err => console.log(err));
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    let xd = new MessageEmbed()
    .setDescription(`Я установил громкость музыки на: **${args[0]/1}/100**`)
    .setAuthor("Громкость музыки", "https://media.discordapp.net/attachments/749638503683326004/783276139963351040/ebeb0045f7c5948c.png?width=675&height=675")
    .setColor("BLUE")
    return message.channel.send(xd);
  },
};
