const { Message, Client, MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    name: "lock",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message) => {

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

        const channelLocked = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription('This voice channel is already locked.\nPlease use ``unlock`` command if you wish to unlock.')

        const channelLockedSuccess = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription('This voice channel is now locked.\nPlease use ``unlock`` command if you wish to unlock.')

        let userVoiceChannel = message.member.voice.channel;
        let userCategoryChannel = message.member.voice.channel.parent;


        if(!userVoiceChannel) return message.channel.send({ embeds: [noVoiceConnected] }).catch(err => console.error)

        if(userVoiceChannel.name.startsWith("Public")) return message.channel.send({ embeds: [publicChannelConnected] }).catch(err => console.error)

        if(userCategoryChannel.name.includes("Table") && !userCategoryChannel.name.includes(message.member.displayName + "'s")) return message.channel.send({ embeds: [notTableOwner] }).catch(err => console.error)

        if(message.channel.parentId !== message.member.voice.channel.parentId) return message.channel.send({ embeds: [wrongChannel] }).catch(err => console.error)

        if(userVoiceChannel.name.includes("🔒")) return message.channel.send({ embeds: [channelLocked] }).catch(err => console.error)

        let userNickname = message.member.displayName;
        let lockedVoiceChannel = userVoiceChannel.name + " 🔒";
        //Lock Channel
        await userVoiceChannel.permissionOverwrites.set([
            {
               id: message.guild.roles.everyone.id,
               deny: [Permissions.FLAGS.CONNECT],
            },
          ],).catch(err => console.error)
        await userVoiceChannel.setName(lockedVoiceChannel).catch(err => console.error)
        .then(await message.channel.send({ embeds: [channelLockedSuccess] })).catch(err => console.error)
    }
}