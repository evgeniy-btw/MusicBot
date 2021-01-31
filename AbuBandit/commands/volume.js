const { canModifyQueue } = require("../util/MusicUtil");

module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "Изменение громкости воспроизводимой в данный момент музыки",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("Там ничего не играет.").catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply("Сначала вам нужно присоединиться к голосовому каналу!").catch(console.error);

    if (!args[0]) return message.reply(`🔊 Текущая громкость составляет: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("Пожалуйста, используйте номер для установки громкости.").catch(console.error);
    if (Number(args[0]) > 100 || Number(args[0]) < 0 )
      return message.reply("Пожалуйста, используйте номер между 0 - 100.").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`Громкость установлена: **${args[0]}%**`).catch(console.error);
  }
};
