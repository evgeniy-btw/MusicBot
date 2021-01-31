const { canModifyQueue } = require("../util/MusicUtil");

module.exports = {
  name: "loop",
  aliases: ["l"],
  description: "Зациклить музыку",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Сейчас ничего не играет.").catch(console.error);
    if (!canModifyQueue(message.member)) return;


    queue.loop = !queue.loop;
    return queue.textChannel.send(`Зациклевание музыки ${queue.loop ? "**вкл**" : "**выкл**"}`).catch(console.error);
  }
};
