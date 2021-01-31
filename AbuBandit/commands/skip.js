const { canModifyQueue } = require("../util/MusicUtil");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: "Пропустить музыку",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("Нет ничего такого, что я мог бы пропустить для тебя.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ пропустил песню`).catch(console.error);
  }
};
