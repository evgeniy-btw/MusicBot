const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "resume",
    description: "Возобновить остановленную музыку.",
    usage: "",
    aliases: [],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      .setDescription("▶ Включил музыку для тебя!")
      .setColor("YELLOW")
      .setAuthor("Музыка включена!", "https://media.discordapp.net/attachments/749638503683326004/783276139963351040/ebeb0045f7c5948c.png?width=675&height=675")
      return message.channel.send(xd);
    }
    return sendError("На этом сервере сейчас не играет музыка.", message.channel);
  },
};
