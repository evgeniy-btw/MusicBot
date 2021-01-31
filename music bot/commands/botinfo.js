const Discord = require("discord.js")

const { version } = require("discord.js");
const moment = require("moment");
const m = require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat")
const ms = require("ms");
const { url } = require("inspector");




module.exports = {
    info: {
    name: "botinfo",
    description: "Отправляет подробную информацию о боте",
    usage: "",
    aliases: ["bot"],
},

  run: async (client, message, args) => {

  let cpuLol;
  cpuStat.usagePercent(function(err, percent, seconds) {
      if (err) {
          return console.log(err);
      }
      const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
      const botinfo = new Discord.MessageEmbed()
          .setAuthor(client.user.username)
          .setTitle("__**Статистика:**__")
          .setColor("RANDOM")
          .addField("⏳ Потребление памяти:", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
          .addField("⌚️ Время работы:", `${duration}`, true)
          .addField("📁 Всего пользователей:", `${client.users.cache.size}`, true)
          .addField("📁 Всего серверов:", `${client.guilds.cache.size}`, true)
          .addField("📁 Всего каналов:", `${client.channels.cache.size}`, true)
          .addField("👾 Версия Discord.js", `v${version}`, true)
          .addField("🤖 Node", `${process.version}`, true)
          .addField("🤖 CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
          .addField("🤖 CPU Используется", `\`${percent.toFixed(2)}%\``, true)
          .addField("💻 Платформа", `\`\`${os.platform()}\`\``, true)
          .addField("Задержка API", `${(client.ws.ping)}ms`)
          .addField("Discord Сервер", "[Абу Бандит - Поддержка](https://discord.gg/xV5TgxPybd)")
          .addField("Donate", "[Абу Бандит - Donate](https://www.donationalerts.com/r/1sh0t)")

      message.channel.send(botinfo)
  });
  }
  }; 