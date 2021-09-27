const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const music = require("./music");

module.exports = {
    name: "help",
    description: "Show help",

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
     run: async (client, interaction, args) => {

        const helpEmbed = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()

        const musicEmbed = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()

        const helpButtons = new MessageActionRow()
        const musicButtons = new MessageActionRow()

        helpEmbed.setTitle(`Reservation Help`)
        helpEmbed.setDescription(`At ${interaction.guild.name}, you can make a Private "Table" for you and your friends to play.`)
        helpEmbed.addField(`How ?`,`It's easy.\nYou just need to connect to a a voice channel named "Reserve Here!"\nYou will get a private category with a text and voice channel for you to use.\nAlternatively, you can use ` + "``/create``" + ` and get the same results.`)
        helpEmbed.addField(`Lock System`, `By default, every created table is in Unlocked state\nIf you need some privacy, simply use ` + "``/lock``" + ` command to avoid anyone connect to your table.`, true)
        helpEmbed.addField(`Invite System`, `While the table is in Locked state, if you want to allow someone to connect, you can ask them to connect to Waiting Lounge and use ` + "``/invite``" + ` to move the user to your channel.`, true)
        helpEmbed.addField(`Region Change`, `If you wish to change your voice RTC Region\nYou can use ` + "``/region``" + ` to change to your preferred region`, true)

        helpButtons.addComponents(
            new MessageButton()
                .setCustomId(`reservation`)
                .setLabel(`🏠`)
                .setStyle('SECONDARY')
                .setDisabled(true),
        );

        helpButtons.addComponents(
            new MessageButton()
                .setCustomId(`music`)
                .setLabel(`🎵`)
                .setStyle('SECONDARY'),
        );

        niya = interaction.guild.members.cache.get("407170163553861632");
        mugi = interaction.guild.members.cache.get("881356777155870721");
        mashu = interaction.guild.members.cache.get("890240719636267028");

        if(niya.voice.channel) { niyaVoiceStatus = `Not Available 🚫`} else { niyaVoiceStatus = `Available :white_check_mark:` }
        if(mugi.voice.channel) { mugiVoiceStatus = `Not Available 🚫`} else { mugiVoiceStatus = `Available :white_check_mark:` }
        if(mashu.voice.channel) { mashuVoiceStatus = `Not Available 🚫`} else { mashuVoiceStatus = `Available :white_check_mark:` }

        musicEmbed.setTitle(`Music`)
        musicEmbed.setDescription(`Want to listen songs together but don't know how? We got you covered!\n\n**Make sure you summon the available maid in order not to interrupt the others.**\n
        You may check the availability in this page\n\nTo check all supported commands you can use ` + "``[prefix]musichelp``" + `\n\n**Name [Prefix]**\n\n`)
        musicEmbed.addField("Niya [!]", niyaVoiceStatus, true)
        musicEmbed.addField("Mugi [~]", mugiVoiceStatus, true)
        musicEmbed.addField("Mashu [?]", mashuVoiceStatus, true)
        musicEmbed.setImage(`https://cdn.discordapp.com/attachments/892108012179816448/892108474064961597/music_play.gif`)

        musicButtons.addComponents(
            new MessageButton()
                .setCustomId(`reservation`)
                .setLabel(`🏠`)
                .setStyle('SECONDARY'),
        );

        musicButtons.addComponents(
            new MessageButton()
                .setCustomId(`music`)
                .setLabel(`🎵`)
                .setStyle('SECONDARY')
                .setDisabled(true),
        );

        await interaction.editReply({ embeds: [helpEmbed], components: [helpButtons]})

        //Collector
        const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'reservation') {
                await client.wait(150)
                return i.update({ embeds: [helpEmbed], components: [helpButtons]})
                } if (i.customId === 'music') {
                    await client.wait(150)
                    return i.update({ embeds: [musicEmbed], components: [musicButtons]})
                }
            });
                
            collector.on('end', collected => {
                interaction.editReply({ components: [] })
                return
            });
     }
}