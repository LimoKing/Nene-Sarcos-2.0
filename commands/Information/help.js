const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "help",
    category: "Information",
    aliases: ["h", "commandinfo", "cmds", "cmd"],
    cooldown: 4,
    useage: "help [Command]",
    description: "Retorna todos los comandos o uno en especifico",
    run: async (client, message, args, user, text, prefix) => {
      try{
        if (args[0]) {
          const embed = new MessageEmbed();
          const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
          if (!cmd) {
              return message.channel.send(embed.setColor(ee.wrongcolor).setDescription(`No se encontró informacion sobre el comando **${args[0].toLowerCase()}**`));
          }
          if (cmd.name) embed.addField("**Nombre de comando**", `\`${cmd.name}\``);
          if (cmd.name) embed.setTitle(`Informacion detallada sobre:\`${cmd.name}\``);
          if (cmd.description) embed.addField("**Descripcion**", `\`${cmd.description}\``);
          if (cmd.aliases) embed.addField("**Variantes**", `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
          if (cmd.cooldown) embed.addField("**Cooldown**", `\`${cmd.cooldown} Segundos\``);
          else embed.addField("**Cooldown**", `\`1 segundo\``);
          if (cmd.usage) {
              embed.addField("**Uso**", `\`${config.prefix}${cmd.usage}\``);
              embed.setFooter("Syntax: <> = requerido, [] = opcional");
          }
          if (cmd.useage) {
              embed.addField("**Uso**", `\`${config.prefix}${cmd.useage}\``);
              embed.setFooter("Syntax: <> =requerido, [] = opcional");
          }
          return message.channel.send(embed.setColor(ee.main));
        } else {
          const embed = new MessageEmbed()
              .setColor(ee.color)
              .setThumbnail(client.user.displayAvatarURL())
              .setTitle("HELP MENU 🔰 Comandos")
              .setFooter(`Para ver informacion sobre un comando, escribe: ${config.prefix}help [COMANDO]`, client.user.displayAvatarURL());
          const commands = (category) => {
              return client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
          };
          try {
            for (let i = 0; i < client.categories.length; i += 1) {
              const current = client.categories[i];
              const items = commands(current);
              const n = 3;
              const result = [[], [], []];
              const wordsPerLine = Math.ceil(items.length / 3);
              for (let line = 0; line < n; line++) {
                  for (let i = 0; i < wordsPerLine; i++) {
                      const value = items[i + line * wordsPerLine];
                      if (!value) continue;
                      result[line].push(value);
                  }
              }
              embed.addField(`**${current.toUpperCase()} [${items.length}]**`, `> ${result[0].join("\n> ")}`, true);
              embed.addField(`\u200b`, `${result[1].join("\n") ? result[1].join("\n") : "\u200b"}`, true);
              embed.addField(`\u200b`, `${result[2].join("\n") ? result[2].join("\n") : "\u200b"}`, true);
            }
          } catch (e) {
              console.log(String(e.stack).red);
          }
          message.channel.send(embed);
      }
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