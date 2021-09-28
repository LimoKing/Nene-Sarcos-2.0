const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { getTracks, getPreview } = require("spotify-url-info");
const DeezerPublicApi = require('deezer-public-api');
let deezer = new DeezerPublicApi();
module.exports = {
    name: "play",
    category: "Music",
    aliases: ["p", "pl", "pla"],
    cooldown: 1,
    useage: "play <URL / NOMBRE>",
    description: "Reproduce una cancion de youtube y spotify",
    run: async (client, message, args, cmduser, text, prefix) => {
    try{

      const { channel } = message.member.voice;

      if(!channel)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | Entra en el canal primero por favor`)
        );

      if(client.distube.isPlaying(message) && channel.id !== message.guild.me.voice.channel.id)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | Entra en el canal **DONDE ESTOY** primero por favor`)
          .setDescription(`Channelname: \`${message.guild.me.voice.channel.name}\``)
        );

      if(!args[0])
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | No diste algo para buscar`)
          .setDescription(`Uso: \`${prefix}play <URL / NOMBRE>\``)
        );

      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext,ee.footericon)
        .setTitle("Buscando la cancion...")
        .setDescription(`\`\`\`fix\n${text}\n\`\`\``)
      ).then(msg=>msg.delete({timeout: 3000}).catch(e=>console.log(e.message)));

      //Spotify Cancion
      if(args.join(" ").toLowerCase().includes("spotify") && args.join(" ").toLowerCase().includes("track"))
      {
        getPreview(args.join(" ")).then(result =>
          {
            client.distube.play(message, result.title);
          })
      }

      //Spotify playlist
      else if(args.join(" ").toLowerCase().includes("spotify") && args.join(" ").toLowerCase().includes("playlist"))
      {
        getTracks(args.join(" ")).then(result =>
          {
            for(const song of result)
            {
              client.distube.play(message, song.name);
            }
          })
      }
      else
      {
        client.distube.play(message, text);
      }
      
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