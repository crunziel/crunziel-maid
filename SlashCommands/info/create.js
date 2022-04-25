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


        const welcomeMessage = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setTitle(`This table is reserved for <@${interaction.member.displayName}>`)
        .setDescription(`Hey <@${interaction.member.id}>!, i am sorry for the mention, we hope you enjoy your visit here!`)
        .setImage('https://i.crunziel.com/reserved.jpeg')

        const inviteFriends = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setTitle(`Invite your friends!`)
        .setDescription(`Pro Tip : You can actually right click your chit-chat or voice channel to invite your friends! pretty cool right?\nBut please keep in mind that you can only do this on your table.`)


        const musicQueuing = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setTitle(`Music Queuing`)
        .setDescription(`If you want to summon a maid or butler,\nPlease use ` + '``/music``' + ` command to check the availability in order not to interrupt the others.\n\nThank you for your understanding.\nHave a good time!`)

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
                    id: newState.member.id,
                    allow: [Permissions.FLAGS.CREATE_INSTANT_INVITE],
                },
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
                    id: newState.member.id,
                    allow: [Permissions.FLAGS.CREATE_INSTANT_INVITE],
                },
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
                await interaction.guild.channels.cache.get(text.id).send({ embeds : [inviteFriends] })
                await interaction.guild.channels.cache.get(text.id).send({ embeds : [musicQueuing] })
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
