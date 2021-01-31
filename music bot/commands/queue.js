const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "queue",
    description: "Показать очередь музыки на сервере.",
    usage: "",
    aliases: ["q", "list", "songlist", "song-list"],
  },

  run: async function (client, message, args) {
 
  const permissions = message.channel.permissionsFor(message.client.user);
    if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
      return sendError("Отсутствует разрешение на управление сообщениями или добавление реакций",message.channel);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("На этом сервере сейчас не играет музыка.",message.channel)

    let currentPage = 0;
    const embeds = generateQueueEmbed(message, queue.songs);

    const queueEmbed = await message.channel.send(
      `**\`${currentPage + 1}\`**/**${embeds.length}**`,
      embeds[currentPage]
    );

    try {
      await queueEmbed.react("⬅️");
      await queueEmbed.react("🛑");
      await queueEmbed.react("➡️");
    } catch (error) {
      console.error(error);
      message.channel.send(error.message).catch(console.error);
    }

    const filter = (reaction, user) =>
      ["⬅️", "🛑", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
    const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

    collector.on("collect", async (reaction, user) => {
      try {
        if (reaction.emoji.name === "➡️") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit(`**\`${currentPage + 1}\`**/**${embeds.length}**`, embeds[currentPage]);
          }
        } else if (reaction.emoji.name === "⬅️") {
          if (currentPage !== 0) {
            --currentPage;
            queueEmbed.edit(`**\`${currentPage + 1}\`**/**${embeds.length}**`, embeds[currentPage]);
          }
        } else {
          collector.stop();
          reaction.message.reactions.removeAll();
        }
        await reaction.users.remove(message.author.id);
      } catch (error) {
        console.error(error);
        return message.channel.send(error.message).catch(console.error);
      }
    });
  }
};

function generateQueueEmbed(message, queue) {
  let embeds = [];
  let k = 10;

  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;

    const info = current.map((track) => `**\`${++j}\`** | [\`${track.title}\`](${track.url})`).join("\n");
  
    const serverQueue =message.client.queue.get(message.guild.id);
    const embed = new MessageEmbed()
     .setAuthor("Очередь песен на сервере", "https://media.discordapp.net/attachments/749638503683326004/783276139963351040/ebeb0045f7c5948c.png?width=675&height=675")
    .setThumbnail(message.guild.iconURL())
    .setColor("BLUE")
    .setDescription(`${info}`)
    .addField("Сейчас играет", `[${queue[0].title}](${queue[0].url})`, true)
    .addField("Текстовый канал", serverQueue.textChannel, true)
    .addField("Голосовой канал", serverQueue.voiceChannel, true)
    .setFooter("Громкость музыки на сервере "+serverQueue.volume)
     if(serverQueue.songs.length === 1)embed.setDescription(`Нет песен для воспроизведения далее добавилась песня \`\`${message.client.config.prefix} играет <song_name>\`\``)

    embeds.push(embed);
  }

  return embeds;
 
};
