const Distube = require("distube");
const ee = require("../botconfig/embed.json");
const config = require("../botconfig/config.json");
const { MessageEmbed } = require("discord.js");
const { format } = require("../handlers/functions")
module.exports = (client) => {

  client.distube = new Distube(client, {
    searchSongs: false,
    emitNewSongOnly: false,
    highWaterMark: 1024*1024*64,
    leaveOnEmpty: true,
    leaveOnFinish: false,
    leaveOnStop: false,
    // youtubeCookie --> Previene el error 429 de youtube pero lo hago despues
    youtubeDL: true,
    updateYouTubeDL: true,
    customFilters: {
      "clear": "dynaudnorm=f=200",
      "bassboost": "bass=g=20,dynaudnorm=f=200",
      "8D": "apulsator=hz=0.08",
      "vaporwave": "aresample=48000,asetrate=48000*0.8",
      "nightcore": "aresample=48000,asetrate=48000*1.25",
      "phaser": "aphaser=in_gain=0.4",
      "tremolo": "tremolo",
      "vibrato": "vibrato=f=6.5",
      "reverse": "areverse",
      "treble": "treble=g=5",
      "normalizer": "dynaudnorm=f=200",
      "surrounding": "surround",
      "pulsator": "apulsator=hz=1",
      "subboost": "asubboost",
      "karaoke": "stereotools=mlev=0.03",
      "flanger": "flanger",
      "gate": "agate",
      "haas": "haas",
      "mcompand": "mcompand"
    }

  })

  // Queue status template
  const status = (queue) => `Volume: \`${queue.volume}%\` | Filtro: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "Esta cancion" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

  // DisTube event listeners, more in the documentation page
  client.distube
      .on("playSong", (message, queue, song) => message.channel.send(new MessageEmbed()
        .setTitle("Nene Sarcos está mezclando :notes: " + song.name)
        .setURL(song.url)
        .setColor(ee.color)
        .addField("Duración", `\`${song.formattedDuration}\``)
        .addField("Estado del playlist", status(queue))
        .setThumbnail(song.thumbnail)
        .setFooter(`La pidió: ${song.user.tag}`, song.user.displayAvatarURL({dynamic: true}))
        )
      )
      .on("addSong", (message, queue, song) => message.channel.send(new MessageEmbed()
          .setTitle("Añadida :thumbsup: " + song.name)
          .setURL(song.url)
          .setColor(ee.color)
          .addField(`${queue.songs.length} Canciones en la playlist`, `Duración: \`${format(queue.duration*1000)}\``)
          .addField("Duración", `\`${song.formattedDuration}\``)
          .setThumbnail(song.thumbnail)
          .setFooter(`La pidió: ${song.user.tag}`, song.user.displayAvatarURL({dynamic: true}))
        )
      )
      .on("playList", (message, queue, playlist, song) => message.channel.send(new MessageEmbed()
            .setTitle("Nene Sarcos metió una playlist :notes: " + playlist.name + ` - \`[${playlist.songs.length} canciones]\``)
            .setURL(playlist.url)
            .setColor(ee.color)
            .addField("Canción sonando: ", `[${song.name}](${song.url})`)
            .addField("Duración", `\`${playlist.formattedDuration}\``)
            .addField(`${queue.songs.length} Canciones en la playlist`, `Duración: \`${format(queue.duration*1000)}\``)
            .setThumbnail(playlist.thumbnail.url)
            .setFooter(`La pidió: ${song.user.tag}`, song.user.displayAvatarURL({dynamic: true}))
        )
      )
      .on("addList", (message, queue, playlist) => message.channel.send(new MessageEmbed()
            .setTitle("Nene Sarcos añadió a la playlist :thumbsup: " + playlist.name + ` - \`[${playlist.songs.length} canciones]\``)
            .setURL(playlist.url)
            .setColor(ee.color)
            .addField("Duración", `\`${playlist.formattedDuration}\``)
            .addField(`${queue.songs.length} Canciones en la playlist`, `Duración: \`${format(queue.duration*1000)}\``)
            .setThumbnail(playlist.thumbnail.url)
            .setFooter(`La pidió: ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
        )
      )
      .on("searchResult", (message, result) =>
          message.channel.send(new MessageEmbed()
                  .setTitle("**Selecciona una opción**")
                  .setURL(song.url)
                  .setColor(ee.color)
                  .setDescription(`${result.map((song, i) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n\n*Enter anything else or wait 60 seconds to cancel*`)
                  .setFooter(ee.footertext,ee.footericon)
          )
      )
      .on("searchCancel", (message) => message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | Busqueda cancelada`)
        )
      )
      .on("error", (message, e) => {
          console.log(String(e.stack).bgRed)
          message.channel.send(new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`❌ ERROR | Un error ha ocurrido`)
              .setDescription(`\`\`\`${e.stack}\`\`\``)
          )
      })
      .on("initQueue", queue => {
          queue.autoplay = false;
          queue.volume = 100;
          queue.filter = "bassboost";
      }
    )

}
