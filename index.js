const { Client, Collection, Intents } = require("discord.js");
const wait = require('util').promisify(setTimeout);
const Enmap = require('enmap');

//Intents
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MEMBERS],
});
module.exports = client;

//Global Database
client.voicedata = new Enmap({
    name: "voicedata",
    fetchAll: true,
    autoFetch: true
})

client.textdata = new Enmap({
    name: "textdata",
    fetchAll: true,
    autoFetch: true
})

client.memberdata = new Enmap({
    name: "memberdata",
    fetchAll: true,
    autoFetch: true
})

// Global Variables
client.slashCommands = new Collection();
client.config = require("./config.json");
client.wait = wait

// Initializing the project
require("./handler")(client);

client.login(client.config.token);
