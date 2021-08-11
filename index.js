const { Client, Collection, Intents } = require("discord.js");
const wait = require('util').promisify(setTimeout);
const Enmap = require('enmap');

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

//Create voiceArray key
if (!client.voicedata.has('voiceArray')) {
    client.voicedata.set('voiceArray', []);
    console.log("[ Database Log ] voiceArray Key Has Been Created");
}

//Create channelOwner key
if (!client.voicedata.has('channelOwner')) {
    client.voicedata.set('channelOwner', {});
    console.log("[ Database Log ] channelOwner Key Has Been Created");
}

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");
client.wait = wait

// Initializing the project
require("./handler")(client);

client.login(client.config.token);
