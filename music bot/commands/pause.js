const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "pause",
    description: "Поставить музыку на паузу.",
    usage: "",
    aliases: [""],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
	    try{
      serverQueue.connection.dispatcher.pause()
	  } catch (error) {
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: Игрок остановил музыку и очередь была очищена.: ${error}`, message.channel);
      }	    
      let xd = new MessageEmbed()
      .setDescription("⏸ Остановил музыку для тебя!")
      .setColor("YELLOW")
      .setTitle("Музыка была приостановлена!")
      return message.channel.send(xd);
    }
    return sendError("На этом сервере сейчас не играет музыка.", message.channel);
  },
};
