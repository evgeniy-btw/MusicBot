const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "loop",
    description: "Зациклить текущую музыку.",
    usage: "",
    aliases: ["l"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
       if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send({
                embed: {
                    color: "GREEN",
                    description: `🔁  **|**  Зацикливание музыки **\`${serverQueue.loop === true ? "enabled" : "disabled"}\`**`
                }
            });
        };
    return sendError("Сейчас на сервере не играет музыка.", message.channel);
  },
};
