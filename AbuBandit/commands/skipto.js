const { canModifyQueue } = require("../util/MusicUtil");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  description: "Перейти к выбранной песнип из очереди",
  execute(message, args) {
    if (!args.length || isNaN(args[0]))
      return message
        .reply(`Использовать: ${message.client.prefix}${module.exports.name} <Номер в очереди>`)
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Очереди нет.").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (args[0] > queue.songs.length)
      return message.reply(`Очередь только ${queue.songs.length} песни длинные!`).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }

    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ пропустил ${args[0] - 1} песен`).catch(console.error);
  }
};
