const move = require("array-move");
const { canModifyQueue } = require("../util/MusicUtil");

module.exports = {
  name: "move",
  aliases: ["mv"],
  description: "Перемещение песен в очереди",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Очереди нет.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!args.length) return message.reply(`Использовать: ${message.client.prefix}move <номер>`);
    if (isNaN(args[0]) || args[0] <= 1) return message.reply(`Usage: ${message.client.prefix}move <номер>`);

    let song = queue.songs[args[0] - 1];

    queue.songs = move(queue.songs, args[0] - 1, args[1] == 1 ? 1 : args[1] - 1);
    queue.textChannel.send(
      `${message.author} 🚚 перемещено **${song.title}** на ${args[1] == 1 ? 1 : args[1] - 1} в очереди.`
    );
  }
};
