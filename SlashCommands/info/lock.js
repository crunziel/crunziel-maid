const { Client, CommandInteraction, MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    name: "lock",
    description: "Lock your voice channel",

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

        const categoryLocked = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription('This voice channel is already locked.\nPlease use ``unlock`` command if you wish to unlock.')

        const channelLockSuccess = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription('This voice channel is now locked.\nPlease use ``unlock`` command if you wish to unlock.')

        let userVoiceChannel = interaction.member.voice.channel;
        let userCategoryChannel = interaction.member.voice.channel.parent;


        if(!userVoiceChannel) return interaction.followUp({ embeds: [noVoiceConnected] }).catch(err => console.error)

        if(userVoiceChannel.name.startsWith("Public")) return interaction.followUp({ embeds: [publicChannelConnected] }).catch(err => console.error)

        if(userCategoryChannel.name.includes("Table") && !userCategoryChannel.name.includes(interaction.member.displayName + "'s")) return interaction.followUp({ embeds: [notTableOwner] }).catch(err => console.error)

        if(interaction.channel.parentId !== interaction.member.voice.channel.parentId) return interaction.followUp({ embeds: [wrongChannel] }).catch(err => console.error)

        if(userCategoryChannel.name.includes("🔒")) return interaction.followUp({ embeds: [categoryLocked] }).catch(err => console.error)

        let userNickname = interaction.member.displayName;
        let lockedVoiceChannel = userCategoryChannel.name + " 🔒";
        //Lock Channel
        await userVoiceChannel.permissionOverwrites.set([
            {
               id: interaction.guild.roles.everyone.id,
               deny: [Permissions.FLAGS.CONNECT],
            },
          ],).catch(err => console.error)
        await userCategoryChannel.setName(lockedVoiceChannel).catch(err => console.error)
        .then(await interaction.followUp({ embeds: [channelLockSuccess] })).catch(err => console.error)
    }
};