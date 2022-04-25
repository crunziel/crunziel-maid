const client = require("../index")
const { MessageEmbed, Permissions } = require('discord.js');

client.on("voiceStateUpdate", async (oldState, newState) => {

    const userNickname = newState.member.displayName;

    if(newState.channelId === client.config.reserveChannel && client.memberdata.has(newState.member.id) === true ) {

        const maxChannelReached = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setTitle('RESERVATION')
        .setDescription(`<@${newState.member.id}>, You only can have 1 table at a time.\nI will move you to your table in 5 seconds.`)

        //Send Message
        await newState.guild.channels.cache.find(c => c.name === "table-history").send({ embeds : [maxChannelReached] }).catch(err => console.error)
        //Transfer User
        return newState.setChannel(client.memberdata.get(newState.member.id)).catch(err => console.error)
    }

    if(newState.channelId === client.config.reserveChannel && newState.member.id !== client.config.botID){

        const welcomeMessage = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setTitle(`This table is reserved for <@${newState.member.id}>`)
        .setImage('https://i.crunziel.com/reserved.jpeg')

        const inviteFriends = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setTitle(`Invite your friends!`)
        .setDescription(`Pro Tip : You can actually right click your chit-chat or voice channel to invite your friends! pretty cool right?\nPlease keep in mind that you can only do this on your table.`)

        const musicQueuing = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setTitle(`Music Queuing`)
        .setDescription(`If you want to summon a maid or butler,\nPlease use ` + '``/music``' + ` command to check the availability in order not to interrupt the others.\n\nThank you for your understanding.\nHave a good time!`)

        const tableProperties = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setTitle(`Table Properties`)
        .addField("Table Owner", `${newState.member.displayName}`, true)
        .addField("Owner ID", `${newState.member.id}`, true)
        .addField("Lock Status", "Unlocked", true)

        const tableHistory = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setTitle('RESERVATION')
        .setDescription(`${newState.member.displayName}, i have reserved a table for you.\nI will move you to the table in 5 seconds.`)


        //Create Category with Permission
        await newState.guild.channels.create(`♢ ${userNickname}'s Table ♢`, {type: 'GUILD_CATEGORY', permissionOverwrites: [
            {
                id: newState.member.id,
                allow: [Permissions.FLAGS.MANAGE_CHANNELS],
            },
        ],}).catch(err => console.error)
        .then(async category => {
            //Create Text Channel
            await newState.guild.channels.create(`chit-chat`, {type: 'GUILD_TEXT', parent: category.id, permissionOverwrites: [
                {
                    id: newState.member.id,
                    allow: [Permissions.FLAGS.CREATE_INSTANT_INVITE],
                },
                {
                    id: newState.member.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL],
                },
                {
                    id: newState.member.id,
                    allow: [Permissions.FLAGS.MANAGE_MESSAGES],
                },
            ],}).catch(err => console.error)
            .then(async text => {
            //Create Voice Channel
            await newState.guild.channels.create(`Voice Chat`, {type: 'GUILD_VOICE', parent: category.id, permissionOverwrites: [
                {
                    id: newState.member.id,
                    allow: [Permissions.FLAGS.CREATE_INSTANT_INVITE],
                },
                {
                    id: newState.member.id,
                    allow: [Permissions.FLAGS.CONNECT],
                },
                {
                    id: newState.member.id,
                    allow: [Permissions.FLAGS.MUTE_MEMBERS],
                },
                {
                    id: newState.member.id,
                    allow: [Permissions.FLAGS.DEAFEN_MEMBERS],
                },
                {
                    id: newState.member.id,
                    allow: [Permissions.FLAGS.MOVE_MEMBERS],
                },
            ],}).catch(err => console.error)
            .then(await newState.guild.channels.cache.find(c => c.name === "table-history").send({ embeds : [tableHistory] }))
            .then(async voice => {
                //Send Welcome Message
                await newState.guild.channels.cache.get(text.id).send({ embeds : [welcomeMessage] })
                await newState.guild.channels.cache.get(text.id).send({ embeds : [inviteFriends] })
                await newState.guild.channels.cache.get(text.id).send({ embeds : [musicQueuing] })
                await newState.guild.channels.cache.get(text.id).send({ embeds : [tableProperties] }).then(
                    async message => {
                        //Set key
                        client.textdata.set(text.id, {messageID: `${message.id}`, voiceID: `${voice.id}`})
                        //Pin the message
                        message.pin()
                //Create key and pushing an array
                await client.memberdata.set(newState.member.id, voice.id)
                await client.voicedata.set(voice.id, {voiceID: `${voice.id}`, catID: `${category.id}`, textID: `${text.id}`, guildID: `${newState.guild.id}`, memberID: `${newState.member.id}`})
                //Transfer User
                if(newState.channelId === client.config.reserveChannel){
                    await client.wait(2000)
                    console.log(`[ Channels Log ] Created ${userNickname}'s channels at ${newState.guild.id}`)
                    newState.setChannel(voice.id).catch(err => console.error)
                    await client.wait(2000)
                } else return
            })})})
        })
    }

    //Loop
    try{
        if (!oldState.channel) return

        if (!oldState.channel.members.size && client.voicedata.has(oldState.channel.id)) {

            const tabledelete = async () => {
            let voiceID = client.voicedata.get(oldState.channel.id).voiceID
            let guildID = client.voicedata.get(oldState.channel.id).guildID
            let textID = client.voicedata.get(oldState.channel.id).textID
            let catID = client.voicedata.get(oldState.channel.id).catID
            let memberID = client.voicedata.get(oldState.channel.id).memberID

            await oldState.channel.delete();
            client.wait(250)
            await client.guilds.cache.get(guildID).channels.cache.get(textID).delete();
            client.wait(250)
            await client.guilds.cache.get(guildID).channels.cache.get(catID).delete();
            console.log(`[ Channels Log ] ${client.guilds.cache.get(guildID).members.cache.get(memberID).displayName}'s channels destroyed`)
            // Remove the channel id from the temporary channels set
            await client.textdata.delete(textID); //delete textdata
            await client.memberdata.delete(memberID); //delete memberdata
            return client.voicedata.delete(voiceID); //delete voicedata
            }

            if (!newState.channel && oldState.channel.id !== null) return await tabledelete()

            if (oldState.channel.id !== newState.channel.id ) return await tabledelete()
        }
    } catch (error) {
        // Handle any errors
        console.error(error);
    }

});
