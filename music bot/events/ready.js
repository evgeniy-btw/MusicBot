module.exports = async (client) => {
  console.log(`[API] Logged in as ${client.user.username}`);

  client.user.setStatus(`online`);//статус бота
  let statuses = [
    `/help | Абу Бандит`,
    `${client.guilds.cache.size} серверов`//через запятые статусы
  ]
  setInterval(async () => {
    const gencount = Math.floor(Math.random() * statuses.length)
    const statusID = statuses[gencount];
    if(gencount === 0){
    client.user.setActivity(statusID, {
        type: "PLAYING"
    })
    } else {
      client.user.setActivity(statusID, {
        type: "WATCHING"//статус Играет,Смотрит и так далее
    })
    } 
  }, 4000)
};