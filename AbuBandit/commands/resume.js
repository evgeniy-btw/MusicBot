const { canModifyQueue } = require("../util/MusicUtil");

module.exports = {
  name: "resume",
  aliases: ["r"],
  description: "Возобновление воспроизведения музыки",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Остановленных песен нет...").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`${message.author} ▶ включил музыку!`).catch(console.error);
    }

    return message.reply("Очередь не останавливается.").catch(console.error);
  }
};
