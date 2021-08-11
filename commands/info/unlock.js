const { Message, Client, MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    name: "unlock",
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

        const channelUnlocked = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription('This voice channel is already unlocked.\nPlease use ``lock`` command if you wish to lock.')

        const channelUnlockedSuccess = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription('This voice channel is now unlocked.\nHave a great day!')

        let userVoiceChannel = message.member.voice.channel;
        let userCategoryChannel = message.member.voice.channel.parent;


        if(!userVoiceChannel) return message.channel.send({ embeds: [noVoiceConnected] }).catch(err => console.error)

        if(userVoiceChannel.name.startsWith("Public")) return message.channel.send({ embeds: [publicChannelConnected] }).catch(err => console.error)

        let userNickname = message.member.displayName;

        if(userCategoryChannel.name.includes("Table") && !userCategoryChannel.name.includes(message.member.displayName + "'s")) return message.channel.send({ embeds: [notTableOwner] }).catch(err => console.error)

        if(message.channel.parentId !== message.member.voice.channel.parentId) return message.channel.send({ embeds: [wrongChannel] }).catch(err => console.error)


        console.log(message.member.voice.channel.permissionsFor(message.guild.roles.everyone.id).bitfield)
        //check if no 🔒 but have the connect flag deny, unlock it
        if(!userVoiceChannel.name.includes("🔒") && message.member.voice.channel.permissionsFor(message.guild.roles.everyone.id).bitfield === 246996786752n) {
            await userVoiceChannel.permissionOverwrites.set([
                {
                   id: message.guild.roles.everyone,
                   default: [Permissions.FLAGS.CONNECT],
                },
              ],).catch(err => console.error)
            await userVoiceChannel.setName('Voice Chat').catch(err => console.error)
            return message.channel.send({ embeds: [channelUnlockedSuccess] }).catch(err => console.error)
        }

        if(!userVoiceChannel.name.includes("🔒")) return message.channel.send({ embeds: [channelUnlocked] }).catch(err => console.error)

        //Lock Channel
        await userVoiceChannel.permissionOverwrites.set([
            {
               id: message.guild.roles.everyone.id,
               default: [Permissions.FLAGS.CONNECT],
            },
          ],).catch(err => console.error)
        await userVoiceChannel.setName('Voice Chat').catch(err => console.error)
        await message.channel.send({ embeds: [channelUnlockedSuccess] }).catch(err => console.error)
    }
}