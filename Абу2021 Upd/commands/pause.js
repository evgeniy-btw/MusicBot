const { canModifyQueue } = require("../util/MusicUtil");

module.exports = {
  name: "pause",
  description: "Поставить музыку на паузу",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Сейчас ничего не играет.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`${message.author} ⏸ остановил музыку.`).catch(console.error);
    }
  }
};
