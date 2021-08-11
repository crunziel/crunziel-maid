const client = require("../index");
const { joinVoiceChannel } = require('@discordjs/voice');

client.on("ready", async () => {

    joinVoiceChannel({
        channelId: client.config.reserveChannel,
        guildId: client.config.guildID,
        adapterCreator: client.guilds.cache.get(client.config.guildID).voiceAdapterCreator,
    });
    console.log('[ Client ] Connected to Reserve Channel')

    client.user.setPresence({ game: [{ name: 'With CrunzieL <3' }] })
    console.log(`[ Client ] ${client.user.username} is now Online!`)
});