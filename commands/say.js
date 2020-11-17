module.exports.run = async (bot, message, args) => {
    if(message.author.id === "320407113887252482") { return; }

    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);

}
module.exports.help = {
  name: "say",
  aliases: []
}