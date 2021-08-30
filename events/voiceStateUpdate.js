const client = require("../index")
const { MessageEmbed, Permissions } = require('discord.js');

client.on("voiceStateUpdate", async (oldState, newState) => {

    const userNickname = newState.member.displayName;

    if(newState.channelId === client.config.reserveChannel && client.voicedata.has(newState.member.id) === true ) {

        const maxChannelReached = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setTitle('RESERVATION')
        .setDescription(`<@${newState.member.id}>, You only can have 1 table at a time.\nI will move you to your table in 5 seconds.`)

        //Send Message
        await newState.guild.channels.cache.find(c => c.name === "table-history").send({ embeds : [maxChannelReached] }).catch(err => console.error)
        //Transfer User
        return newState.setChannel(client.voicedata.get(newState.member.id)).catch(err => console.error)
    }

    if(newState.channelId === client.config.reserveChannel && newState.member.id !== client.config.botID){

        const welcomeMessage = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setTitle(`RESERVED For ${newState.member.displayName}`)
        .setImage('https://i.crunziel.com/reserved.jpeg')

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
                await newState.guild.channels.cache.get(text.id).send({ embeds : [tableProperties] }).then(
                    async message => {
                        //Set key
                        client.voicedata.set(text.id, message.id)
                        //Pin the message
                        message.pin()
                    })
                //Create key and pushing an array
                await client.voicedata.set(newState.member.id, voice.id)
                await client.voicedata.push("voiceArray", { voiceID: voice.id, catID: category.id, textID: text.id, guildID: newState.guild.id, memberID: newState.member.id })
                //Transfer User
                if(newState.channelId === client.config.reserveChannel){
                    await client.wait(2000)
                    console.log(`[ Channels Log ] Created ${userNickname}'s channels at ${newState.guild.id}`)
                    newState.setChannel(voice.id).catch(err => console.error)
                    await client.wait(2000)
                } else return
            })})
        })
    } 

    //Loop
    if (client.voicedata.get("voiceArray").length >= 0) for(let i = 0; i < client.voicedata.get("voiceArray").length; i++) {
        let ch = client.guilds.cache.find(x => x.id === client.voicedata.get("voiceArray", i).guildID).channels.cache.find(x => x.id === client.voicedata.get("voiceArray", i).voiceID)
        if(ch === undefined) return console.log("[ Channels Log ] CH = UNDEFINED")
                 
        if(ch.members.size <= 0) {
            try{
            //Deleting Channels
            await ch.delete()
            await client.guilds.cache.find(x => x.id === client.voicedata.get("voiceArray", i).guildID).channels.cache.find(x => x.id === client.voicedata.get("voiceArray", i).textID).delete()
            await client.guilds.cache.find(x => x.id === client.voicedata.get("voiceArray", i).guildID).channels.cache.find(x => x.id === client.voicedata.get("voiceArray", i).catID).delete()
            console.log(`[ Channels Log ] ${userNickname}'s channels destroyed`)
            //Removing Key and Array
            await client.voicedata.delete(client.voicedata.get("voiceArray", i).textID) //delete textchannel key ( buat message id di lock/unlock nanti )
            await client.voicedata.delete(client.voicedata.get("voiceArray", i).memberID) //delete member id key ( buat check ada udah punya room / belom )
            return client.voicedata.remove("voiceArray", (value) => value.memberID === newState.member.id)
            }catch (error) {
                console.log(error)
            }  
        }
    }
});