const { canModifyQueue } = require("../util/MusicUtil");

module.exports = {
  name: "remove",
  aliases: ["rm"],
  description: "Удалить песню из очереди",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Очереди нет.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!args.length) return message.reply(`Использовать: ${message.client.prefix}remove <Номер Очереди>`);
    if (isNaN(args[0])) return message.reply(`Использовать: ${message.client.prefix}remove <Номер Очереди>`);

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(`${message.author} ❌ убрано **${song[0].title}** из очереди.`);
  }
};
