const { Client, CommandInteraction, MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    name: "create",
    description: "Reserve a table and move you magically",

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction) => {

        const userNickname = interaction.member.displayName

        const niya = interaction.guild.members.cache.get("407170163553861632");
        const mugi = interaction.guild.members.cache.get("881356777155870721");
        const mashu = interaction.guild.members.cache.get("890240719636267028");

        if(!interaction.member.voice.channel) return interaction.editReply(`<@${interaction.member.id}>, You're not in a voice channel right now.`)

        if(client.memberdata.has(interaction.member.id) === true) {

            const maxChannelReached = new MessageEmbed()
            .setColor(`${client.config.embedColor}`)
            .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
            .setTimestamp()
            .setDescription(`<@${interaction.member.id}>, You only can have 1 table at a time.\nI will move you to your table.`)

            //Transfer User
            await interaction.editReply({ embeds: [maxChannelReached], ephemeral: true })
            return interaction.member.voice.setChannel(client.memberdata.get(interaction.member.id)).catch(err => console.error)

        }

        if(niya.voice.channel) { niyaVoiceStatus = `Not Available`} else { niyaVoiceStatus = `Available` }
        if(mugi.voice.channel) { mugiVoiceStatus = `Not Available`} else { mugiVoiceStatus = `Available` }
        if(mashu.voice.channel) { mashuVoiceStatus = `Not Available`} else { mashuVoiceStatus = `Available` }
    
    
        const welcomeMessage = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setTitle(`Irasshaimase! This table is reserved for ${interaction.member.displayName}`)
        .setImage('https://i.crunziel.com/reserved.jpeg')
    
        const botsAvailable = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setTitle(`Maid and Butler status as of now`)
        .addField("Niya [!]", niyaVoiceStatus, true)
        .addField("Mugi [~]", mugiVoiceStatus, true)
        .addField("Mashu [?]", mashuVoiceStatus, true)
    
        const tableProperties = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setTitle(`Table Properties`)
        .addField("Table Owner", `${interaction.member.displayName}`, true)
        .addField("Owner ID", `${interaction.member.id}`, true)
        .addField("Lock Status", "Unlocked", true)
    
        const tableHistory = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setTitle('RESERVATION')
        .setDescription(`${interaction.member.displayName}, i have reserved a table for you.\nI will move you to the table in 5 seconds.`)

        const tableCreated = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`${interaction.member.displayName}, i have reserved a table for you.\nI will move you to the table.`)
    
    
        //Create Category with Permission
        await interaction.guild.channels.create(`♢ ${userNickname}'s Table ♢`, {type: 'GUILD_CATEGORY', permissionOverwrites: [
            {
                id: interaction.member.id,
                allow: [Permissions.FLAGS.MANAGE_CHANNELS],
            },
        ],}).catch(err => console.error)
        .then(async category => {
            //Create Text Channel
            await interaction.guild.channels.create(`chit-chat`, {type: 'GUILD_TEXT', parent: category.id, permissionOverwrites: [
                {
                    id: interaction.member.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL],
                },
                {
                    id: interaction.member.id,
                    allow: [Permissions.FLAGS.MANAGE_MESSAGES],
                },
            ],}).catch(err => console.error)
            .then(async text => {     
            //Create Voice Channel
            await interaction.guild.channels.create(`Voice Chat`, {type: 'GUILD_VOICE', parent: category.id, permissionOverwrites: [
                {
                    id: interaction.member.id,
                    allow: [Permissions.FLAGS.CONNECT],
                },
                {
                    id: interaction.member.id,
                    allow: [Permissions.FLAGS.MUTE_MEMBERS],
                },
                {
                    id: interaction.member.id,
                    allow: [Permissions.FLAGS.DEAFEN_MEMBERS],
                },
                {
                    id: interaction.member.id,
                    allow: [Permissions.FLAGS.MOVE_MEMBERS],
                },
            ],}).catch(err => console.error)
            .then(await interaction.guild.channels.cache.find(c => c.name === "table-history").send({ embeds : [tableHistory] }))
            .then(async voice => {
                //Send Welcome Message
                await interaction.editReply({ embeds: [tableCreated], ephemeral: true })
                await interaction.guild.channels.cache.get(text.id).send({ embeds : [welcomeMessage] })
                await interaction.guild.channels.cache.get(text.id).send({ embeds : [botsAvailable] })
                await interaction.guild.channels.cache.get(text.id).send({ embeds : [tableProperties] }).then(
                    async message => {
                        //Set key
                        await client.textdata.set(text.id, {messageID: `${message.id}`, voiceID: `${voice.id}`})
                        //Pin the message
                        message.pin()
                        //Create key and pushing an array
                        await client.memberdata.set(interaction.member.id, voice.id)
                        await client.voicedata.set(voice.id, {voiceID: `${voice.id}`, catID: `${category.id}`, textID: `${text.id}`, guildID: `${interaction.guild.id}`, memberID: `${interaction.member.id}`})
                        //Transfer User
                        console.log(`[ Channels Log ] Created ${userNickname}'s channels at ${interaction.guild.id}`)
                        return await interaction.member.voice.setChannel(voice.id).catch(err => console.error)
                    })
                })
            })
        })
    }
};