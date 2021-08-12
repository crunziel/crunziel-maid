const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "invite",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        const noVoiceConnected = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`You are not connected to a voice channel.`)

        const publicChannelConnected = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`You can't invite someone to Public Lounge\nPlease create a table for this feature.`)

        const notTableOwner = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`This table is not yours.\nYou only can invite someone on your table only.`)

        const wrongChannel = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`Please use this command on your table text channel.`)

        const noMentionedUser = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription('To use this command\nYou need to mention the user and the user need to connect to the ``Waiting Lounge``\n\n```Usage: /invite @CrunzieL```')

        const userNotFound = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`Failed to find the user. Please mention the user you want to invite.`)

        const mentionNoVoiceConnected = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`The mentioned user is not connected to a voice channel.`)

        const connectedVoiceChannel = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`The mentioned user need to connect to the Waiting Lounge to be invited.`)
    
        const mentionMoved = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`Mentioned user moved successfully!`)


        function getUserFromMention(mention) {
            if (!mention) return;
        
            if (mention.startsWith('<@') && mention.endsWith('>')) {
                mention = mention.slice(2, -1);
        
                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }
        
                return client.users.cache.get(mention);
            }
        }

        let userVoiceChannel = message.member.voice.channel;

        //Fetch Message
        const fetchMessage = (await message.channel.messages.fetch(client.voicedata.get(message.channel.id)))

        if(!userVoiceChannel) return message.channel.send({ embeds: [noVoiceConnected] }).catch(err => console.error)

        if(userVoiceChannel.name.startsWith("Public")) return message.channel.send({ embeds: [publicChannelConnected] }).catch(err => console.error)

        if(!fetchMessage.embeds[0].fields[1].value === message.member.id) return message.channel.send({ embeds: [notTableOwner] }).catch(err => console.error)

        if(message.channel.parentId !== message.member.voice.channel.parentId) return message.channel.send({ embeds: [wrongChannel] }).catch(err => console.error)

        if (!args[0]) return message.channel.send({ embeds: [noMentionedUser] }).catch(err => console.error)

        if (args[0]) {
            const mentionedUser = getUserFromMention(args[0]);

            const MentionedInvite = async () => {
                await message.channel.send({ embeds: [mentionMoved] }).catch(err => console.error)
                return message.guild.members.cache.get(mentionedUser.id).voice.setChannel(message.member.voice.channel.id).catch(err => console.error)
            }



            if(!mentionedUser){
                let serverID = message.guildId
                let displayNickname = args[0];
                let serverMembers = client.guilds.cache.get(serverID).members
                let matchedMember = serverMembers.cache.find(m => m.displayName === displayNickname)

                try{
                    const matchedMemberID = serverMembers.cache.find(m => m.displayName === displayNickname).id


                    if(!message.guild.members.cache.get(matchedMemberID).voice.channel) return message.channel.send({ embeds: [mentionNoVoiceConnected] }).catch(err => console.error)

                    //Send Em
                    if(message.guild.members.cache.get(matchedMemberID).voice.channel.name.startsWith("Waiting Lounge")) {
                        await message.channel.send({ embeds: [mentionMoved] }).catch(err => console.error)
                        return message.guild.members.cache.get(matchedMemberID).voice.setChannel(message.member.voice.channel.id).catch(err => console.error)

                    if(message.guild.members.cache.get(matchedMemberID).voice.channel) return message.channel.send({ embeds: [connectedVoiceChannel] }).catch(err => console.error)
                }} catch (err) {
                    return message.channel.send({ embeds: [userNotFound] })
                }
            }
            
            //if mentioned
            if(!message.guild.members.cache.get(mentionedUser.id).voice.channel) return message.channel.send({ embeds: [mentionNoVoiceConnected] }).catch(err => console.error)

            if(message.guild.members.cache.get(mentionedUser.id).voice.channel.name.startsWith("Waiting Lounge")) return MentionedInvite()

            if(message.guild.members.cache.get(mentionedUser.id).voice.channel) return message.channel.send({ embeds: [connectedVoiceChannel] }).catch(err => console.error)
        }
    }
}