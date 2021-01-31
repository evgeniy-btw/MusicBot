const { canModifyQueue } = require("../util/MusicUtil");

module.exports = {
  name: "stop",
  description: "Остановить музыку",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("Сейчас ничего не играет.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏹ остановил музыку!`).catch(console.error);
  }
};
