/**
  * @INFO
  * Loading all needed File Information Parameters
*/
const config = require("../../botconfig/config.json"); //loading config file with token and prefix, and settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const { escapeRegex} = require("../../handlers/functions"); //Loading all needed functions
//here the event starts
module.exports = async (client, message) => {
  try {
    //if the message is not in a guild (aka in dms), return aka ignore the inputs
    if (!message.guild) return;
    // if the message  author is a bot, return aka ignore the inputs
    if (message.author.bot) return;
    //if the channel is on partial fetch it
    if (message.channel.partial) await message.channel.fetch();
    //if the message is on partial fetch it
    if (message.partial) await message.fetch();
    //get the current prefix from the botconfig/config.json
    let prefix = config.prefix
    //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    //if its not that then return
    if (!prefixRegex.test(message.content)) return;
    //now define the right prefix either ping or not ping
    const [, matchedPrefix] = message.content.match(prefixRegex);
    //create the arguments with sliceing of of the rightprefix length
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    //creating the cmd argument by shifting the args by 1
    const cmd = args.shift().toLowerCase();
    //if no cmd added return error
    if (cmd.length === 0) return message.channel.send(new Discord.MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(ee.footertext, ee.footericon)
      .setTitle(`❌ Comando desconocido, intenta con:: **\`${prefix}help\`**`)
      .setDescription(`Para reproducir musica simplemente escribe \`${prefix}play <URL / NOMBRE>\`\n\nPara crear un una configuracion usa: \`${prefix}setup\``)
    )
    //get the command from the collection
    let command = client.commands.get(cmd);
    //if the command does not exist, try to get it by his alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    //if the command is now valid
    if (command){
        if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
            client.cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now(); //get the current time
        const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
        const cooldownAmount = (command.cooldown || 1.5) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
        if (timestamps.has(message.author.id)) { //if the user is on cooldown
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
          if (now < expirationTime) { //if he is still on cooldonw
            const timeLeft = (expirationTime - now) / 1000; //get the lefttime
            return message.channel.send(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext,ee.footericon)
              .setTitle(`❌ Por favor espera ${timeLeft.toFixed(1)} segundos(s) antes de usar el comando \`${command.name}\`.`)
            ); //send an information message
          }
        }
        timestamps.set(message.author.id, now); //if he is not on cooldown, set it to the cooldown
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
      try{
        //try to delete the message of the user who ran the cmd
        try{  message.delete();   }catch{}
        //if Command has specific permission return error
        if(command.memberpermissions && !message.member.hasPermission(command.memberpermissions)) {
          return message.channel.send(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle("❌ Error | No tienes permiso para usar el comando")
            .setDescription(`Necesitas estos permisos: \`${command.memberpermissions.join("`, ``")}\``)
          ).then(msg=>msg.delete({timeout: 5000}).catch(e=>console.log("No pude borrar --> Ignorar".gray)));
        }
        //if the Bot has not enough permissions return error
        if(!message.guild.me.hasPermission("ADMINISTRATOR")){
          return message.channel.send(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle("❌ Error | No tengo los permisos suficientes")
          .setDescription("Por favor dame admin que necesito borrar mis propios mensajes, si no, no puedo funcionar bien"))
        }
        //run the command with the parameters:  client, message, args, user, text, prefix,
        command.run(client, message, args, message.member, args.join(" "), prefix);
      }catch (e) {
        console.log(String(e.stack).red)
        return message.channel.send(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle("❌ Algo salio mal mientras ejecutaba este comando: `" + command.name + "`")
          .setDescription(`\`\`\`${e.message}\`\`\``)
        ).then(msg=>msg.delete({timeout: 5000}).catch(e=>console.log("No pude borrar --> Ignorar".gray)));
      }
    }
    else //if the command is not found send an info msg
    return message.channel.send(new Discord.MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(ee.footertext, ee.footericon)
      .setTitle(`❌ Comando desconocido, intenta esto: **\`${prefix}help\`**`)
      .setDescription(`Para reproducir musica solamente intenta: \`${prefix}play <URL / NOMBRE>\``)
    ).then(msg=>msg.delete({timeout: 5000}).catch(e=>console.log("No pude borrar --> Ignorar".gray)));
  }catch (e){
    return message.channel.send(
    new MessageEmbed()
    .setColor("RED")
    .setTitle(`❌ ERROR | Ha ocurrido un error`)
    .setDescription(`\`\`\`${e.stack}\`\`\``)
);
  }
}
