const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { getTracks, getPreview } = require("spotify-url-info");
const DeezerPublicApi = require('deezer-public-api');
let deezer = new DeezerPublicApi();
module.exports = {
    name: "shuffle",
    category: "Music",
    aliases: ["sh", "shu", "shuf", "shuff", "shuffl"],
    cooldown: 1,
    useage: "shuffle",
    description: "Mezcla la playlist.",
    run: async (client, message, args, cmduser, text, prefix) => {
    try{

      const { channel } = message.member.voice;

      if(!channel)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | Entra en el canal primero por favor`)
        );

      if(!client.distube.getQueue(message))
      {
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | No puedo mezclar nada si no estoy reproduciendo nada`)
          .setDescription(`La playlist está vacía`)
        );
      }

      if(client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | Entra en el canal **DONDE ESTOY** primero por favor`)
          .setDescription(`Channelname: \`${message.guild.me.voice.channel.name}\``)
        );

      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext,ee.footericon)
        .setTitle("Se mezcló con éxito 🤙🎶")
      ).then(msg=>msg.delete({timeout: 3000}).catch(e=>console.log(e.message)));

      client.distube.shuffle(message);
      
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | Un error ha ocurrido`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
  }
}