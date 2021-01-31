module.exports = {
  name: "uptime",
  aliases: ["u"],
  description: "Время работы бота",
  execute(message) {
    let seconds = Math.floor(message.client.uptime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    return message
      .reply(`Время работы: \`${days} дней,${hours} час(ов), ${minutes} минут, ${seconds} секунд\``)
      .catch(console.error);
  }
};
