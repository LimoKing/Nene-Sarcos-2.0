/*
Ahora una pequeña explicación a quien sea que esté viendo este codigo en especial si eres nuevo en esto
hay que dejar en claro lo que es un string, un array y un object
Un string a un muy alto nivel basicamente son palabras "Esto es un string", una cadena de caracteres
y se declara usando "" o '' 
Ej: "esto es un string", 'esto es un string'
si pasas a la consola un string te devolverá el string
Ej: console.log(string) --> Esto es un string
Un array es una lista de cosas, un string puede ser un array de caracteres o multiples string u objetos.
Lo que te imagines, se declaran usando []
Ej: ["Esto", "es", "un", "array"];
Si lo mandas a la consola te devolverá el array
Ej: console.log(array) --> ["Esto", "es", "un", "array"]
Sin embargo, si necesitas sacar un elemento especifico del array puedes hacerlo especificando con el index
que empieza desde 0.
Ej: console.log(array[1]) --> es ... ¿Por que "es"? para el array el index 0 es "esto", index 1 "es", index 2 "un"
index 3 "array"
Un objeto es eso, un objeto que dentro de si contiene infinitas propiedades, estas propiedades se organizan en
elementos par de Key y Value, es decir, por cada key, la key deberá tener un value y se denota como {}
Ej: Object = { "key": "value" }
    manzana =
        {
            "color": "rojo",
            "tipo": "fruta",
            "tamaño": "pequeño"
        }
Si lo mandas a la consola la forma de pasar datos es la siguiente
Ej: console.log(object) -->  { "key": "value" }
    console.log(object.key) --> "value"
Ej: console.log(manzana) --> { "color": "rojo", "tipo": "fruta", "tamaño": "pequeño" }
    console.log(manzana.color) --> "rojo"
*/

// ------------------------------------ DISCORD BOT NENE SARCOS V2.0 --------------------------------- //
// ------------------------------------------ CONFIGURACION ------------------------------------------ //

//Dependencias
const Discord = require("discord.js");
const colors = require("colors");
const fs = require("fs");

//Creando el bot
const client = new Discord.Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync("./commands/");
client.cooldowns = new Discord.Collection();


["command", "events", "distube-handler"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.login(require("./botconfig/config.json").token);