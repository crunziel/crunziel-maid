const client = require("../index");
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

client.on("ready", async () => {

    const connection = joinVoiceChannel({
        channelId: client.config.reserveChannel,
        guildId: client.config.guildID,
        adapterCreator: client.guilds.cache.get(client.config.guildID).voiceAdapterCreator,
    });

    await connection;
    connection.on(VoiceConnectionStatus.Ready, () => {
        console.log('[ Client ] Connected to Reserve Channel');
    });

    connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            await connection.destroy();
            await connection;
        }
    });

    client.user.setPresence({ game: [{ name: 'With CrunzieL <3' }] })
    console.log(`[ Client ] ${client.user.username} is now Online!`)
});