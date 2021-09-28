const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "embed",
    category: "Administration",
    aliases: ["say-embed"],
    cooldown: 2,
    useage: "embed <TITLE> ++ <DESCRIPTION>",
    description: "Reenvia un mensaje como un embed",
    run: async (client, message, args, user, text, prefix) => {
    try{
      if(!args[0])
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | No diste ningun titulo y/o descripcion`)
            .setDescription(`Uso: \`${prefix}embed <TITLE> ++ <DESCRIPTION>\``)
        );
      let userargs = args.join(" ").split("++");
      let title = userargs[0];
      let desc = userargs.slice(1).join(" ")
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(title ? title : "")
        .setDescription(desc ? desc : "")
      )
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | un error ha ocurrido`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
  }
}
