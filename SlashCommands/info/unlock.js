const { Client, CommandInteraction, MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    name: "unlock",
    description: "unlock your voice channel",

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const noVoiceConnected = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`You are not connected to a voice channel.`)

        const publicChannelConnected = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`You can't lock Public Lounge\nPlease create a table for this feature.`)

        const notTableOwner = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`This table is not yours.\nYou only can lock your own table.`)

        const wrongChannel = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`Please use this command on your table text channel.`)

        const categoryUnlocked = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription('This voice channel is already unlocked.\nPlease use ``lock`` command if you wish to lock.')

        const channelUnlockSuccess = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription('This voice channel is now unlocked.\nHave a great day!')

        //Fetch Message
        const fetchMessage = (await interaction.channel.messages.fetch(client.textdata.get(interaction.channel.id)))

        //Change Lock Status Value
        const editEmbed = new MessageEmbed(fetchMessage.embeds[0])
        .spliceFields(2, 1, {name: "**Lock Status**", value: "Unlocked", inline: true});

        let userVoiceChannel = interaction.member.voice.channel;
        let userCategoryChannel = interaction.member.voice.channel.parent;

        const unlock = async () => {
            await userVoiceChannel.permissionOverwrites.set([
                {
                   id: interaction.guild.roles.everyone.id,
                   deny: [Permissions.FLAGS.CONNECT],
                },
            ],).catch(err => console.error)

            //Edit Message
            await interaction.channel.messages.fetch(client.textdata.get(interaction.channel.id))
            .then( msg => {
                const fetchedMsg = msg
                fetchedMsg.edit({ embeds: [editEmbed] })
            })
            
            return interaction.followUp({ embeds: [channelUnlockSuccess] }).catch(err => console.error)
        }

        if(!userVoiceChannel) return interaction.followUp({ embeds: [noVoiceConnected] }).catch(err => console.error)

        if(userVoiceChannel.name.startsWith("Public")) return interaction.followUp({ embeds: [publicChannelConnected] }).catch(err => console.error)

        if(!fetchMessage.embeds[0].fields[1].value === interaction.member.id) return interaction.followUp({ embeds: [notTableOwner] }).catch(err => console.error)

        if(interaction.channel.parentId !== interaction.member.voice.channel.parentId) return interaction.followUp({ embeds: [wrongChannel] }).catch(err => console.error)

        //check if no 🔒 but have the connect flag deny, unlock it
        if(fetchMessage.embeds[0].fields[2].value === 'Unlocked' && interaction.member.voice.channel.permissionsFor(interaction.guild.roles.everyone.id).bitfield === 246996786752n) return unlock()

        if(fetchMessage.embeds[0].fields[2].value === 'Unlocked') return interaction.followUp({ embeds: [categoryUnlocked] }).catch(err => console.error)

        //Lock Channel
        return unlock()
    }
};