  
/* eslint-disable no-unused-vars */
const Discord = require("discord.js");
const { NovelCovid } = require("novelcovid");
const { post } = require("snekfetch");

module.exports.run = async (client, message, args) => {

    const track = new NovelCovid();
    const countryStats = await track.countries(null, "cases");
    let topCountries = "";

    for (let i = 0; i < 10; i++) {
      const country = countryStats[i];
      topCountries += `${i+1}. **${country.country}**: ${country.cases} cases - ${country.deaths} deaths - ${country.recovered} recovered\n`;
    }

    const embed = new Discord.RichEmbed()
      .setAuthor("Top 10 Countries with most cases of Coronavirus")
      .setDescription(topCountries)
      .setColor("RANDOM");
    message.channel.send(embed);
  }
module.exports.help = {
  name:"coronatop",
  aliases: [""]
}