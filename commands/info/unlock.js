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
        const fetchMessage = (await message.channel.messages.fetch(client.voicedata.get(message.channel.id)))

        //Change Lock Status Value
        const editEmbed = new MessageEmbed(fetchMessage.embeds[0])
        .spliceFields(2, 1, {name: "**Lock Status**", value: "Unlocked", inline: true});

        let userVoiceChannel = message.member.voice.channel;
        let userCategoryChannel = message.member.voice.channel.parent;

        //Declare unlock
        const unlock = async () => {
          await userVoiceChannel.permissionOverwrites.set([
            {
               id: message.guild.roles.everyone.id,
               default: [Permissions.FLAGS.CONNECT],
            },
            ],).catch(err => console.error)

            //Edit Message
            await message.channel.messages.fetch(client.voicedata.get(message.channel.id))
            .then( msg => {
                const fetchedMsg = msg
                fetchedMsg.edit({ embeds: [editEmbed] })
            })

          return message.channel.send({ embeds: [channelUnlockSuccess] }).catch(err => console.error)
        }

        if(!userVoiceChannel) return message.channel.send({ embeds: [noVoiceConnected] }).catch(err => console.error)

        if(userVoiceChannel.name.startsWith("Public")) return message.channel.send({ embeds: [publicChannelConnected] }).catch(err => console.error)

        let userNickname = message.member.displayName;

        if(!fetchMessage.embeds[0].fields[1].value === message.member.id) return message.channel.send({ embeds: [notTableOwner] }).catch(err => console.error)

        if(message.channel.parentId !== message.member.voice.channel.parentId) return message.channel.send({ embeds: [wrongChannel] }).catch(err => console.error)

        //check if no 🔒 but have the connect flag deny, unlock it anyway
        if(fetchMessage.embeds[0].fields[2].value === 'Unlocked' && userVoiceChannel.permissionsFor(message.guild.roles.everyone.id).bitfield === 246996786752n) return unlock()

        if(fetchMessage.embeds[0].fields[2].value === 'Unlocked') return message.channel.send({ embeds: [categoryUnlocked] }).catch(err => console.error)

        //Calling Unlock
        await unlock()
    }
}