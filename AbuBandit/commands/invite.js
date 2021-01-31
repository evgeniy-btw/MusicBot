const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "invite",
  description: "Пригласить бота на сервер",
  execute(message) {
let inviteEmbed = new MessageEmbed()
  .setTitle(`<:abubandit:792842761732227102> Пригласить ${message.client.user.username}`)
  .addField("<:Discord_icon:785204135431241728> Добавить бота на свой сервер", "[Абу Бандит](https://discord.com/oauth2/authorize?client_id=748201094332547112&permissions=70282305&scope=bot)")
  .addField("<:developer:785207174241714226> Сервер поддержки:","[Абу Бандит - Поддержка](https://discord.gg/xV5TgxPybd)")
  .setColor("RANDOM");

inviteEmbed.setTimestamp();

return message.channel.send(inviteEmbed).catch(console.error);

      
  }
};

