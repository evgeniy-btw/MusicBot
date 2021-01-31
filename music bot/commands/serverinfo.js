const Discord = require("discord.js");

module.exports = {
  info: {
  name: "serverinfo",
  category: "Разное",
  description: "Показывает Информацию о Сервере",
  usage: "",
  aliases: "[server]",
  },

run: async (client, message, args) => {

let servericon = message.guild.iconURL;
let serverembed = new Discord.MessageEmbed()
.setTitle("Информация о сервере")
.setColor("RANDOM")
.setThumbnail(servericon)
.addField("✨Название:", message.guild.name)

.addField("🆔ID сервера:", message.guild.id)

.addField("🌎Регион:", message.guild.region)

.addField("🎁Владелец:", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)

.addField("🔥Все каналы и категории:", message.guild.channels.cache.size, true)

.addField("🎭Роли:", message.guild.roles.cache.size, true)

.addField("👥Участники:", message.guild.memberCount)

.setThumbnail(message.guild.iconURL())

message.channel.send(serverembed);
}
};