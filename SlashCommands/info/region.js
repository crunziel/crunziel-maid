const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "region",
    description: "Set region for your voice channel",

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
     run: async (client, interaction, args) => {

        const embed = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()

        const buttons = new MessageActionRow()
        
        let userVoiceChannel = interaction.member.voice.channel;


        if(!userVoiceChannel) {
            embed.setTitle(`Set Region Error`)
            embed.setDescription(`You are not connected to a voice channel.`)
            return interaction.editReply({ embeds: [embed] })
        }

        if(userVoiceChannel.name.startsWith("Public")) {
            embed.setTitle(`Set Region Error`)
            embed.setDescription(`You can't set Public Lounge region.\nPlease create a table for this feature.`)
            return interaction.editReply({ embeds: [embed] })
        }

        if(interaction.channel.parent.id !== interaction.member.voice.channel.parent.id) {
            embed.setTitle(`Set Region Error`)
            embed.setDescription(`Please use this command on your table text channel.`)
            return interaction.editReply({ embeds: [embed] })
        }

        const fetchMessage = await interaction.channel.messages.fetch(client.textdata.get(interaction.channel.id).messageID)

        if(fetchMessage.embeds[0].fields[1].value !== interaction.member.id) {
            embed.setTitle(`Set Region Error`)
            embed.setDescription(`This table is not yours.\nYou only can set your own table.\nKindly please create a table for this feature.`)
            return interaction.editReply({ embeds: [embed] })
        }

        //Singapore
        buttons.addComponents(
            new MessageButton()
                .setCustomId('singapore')
                .setLabel('Singapore')
                .setStyle('SECONDARY'),
        );

        //Sydney
        buttons.addComponents(
            new MessageButton()
                .setCustomId('sydney')
                .setLabel('Sydney')
                .setStyle('SECONDARY'),
        );       

        //Hongkong
        buttons.addComponents(
            new MessageButton()
                .setCustomId('hongkong')
                .setLabel('Hongkong')
                .setStyle('SECONDARY'),
        );

        //Hongkong
        buttons.addComponents(
            new MessageButton()
                .setCustomId('automatic')
                .setLabel('Automatic')
                .setStyle('SECONDARY'),
        );
        
        embed.setTitle(`Set Region`)
        embed.setDescription(`Please choose a region\n\nCurrent region : **${userVoiceChannel.rtcRegion}**\n\nCrunziel: If you need more region, please let me know.`)

        //YEEEEET
        interaction.editReply({ embeds: [embed], components: [buttons] })

        //Collector
        const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

        collector.on('collect', async i => {

            if(i.customId === 'singapore') {
                await userVoiceChannel.setRTCRegion('singapore').catch(err => console.error)
                embed.setTitle(`Set Region Success`)
                embed.setDescription(`RTC Region changed to Singapore by ${i.member.displayName}`)
                console.log(`[ Region ] Voice Channel ID : <${userVoiceChannel.id}> RTC Region changed to Singapore by ${i.member.displayName}`)
                return await i.update({ embeds: [embed], components: [] });
            } if(i.customId === 'sydney') {
                await userVoiceChannel.setRTCRegion('sydney').catch(err => console.error)
                embed.setTitle(`Set Region Success`)
                embed.setDescription(`RTC Region changed to Sydney by ${i.member.displayName}`)
                console.log(`[ Region ] Voice Channel ID : <${userVoiceChannel.id}> RTC Region changed to Sydney by ${i.member.displayName}`)
                return await i.update({ embeds: [embed], components: [] });
            } if(i.customId === 'hongkong') {
                await userVoiceChannel.setRTCRegion('hongkong').catch(err => console.error)
                embed.setTitle(`Set Region Success`)
                embed.setDescription(`RTC Region changed to Hongkong by ${i.member.displayName}`)
                console.log(`[ Region ] Voice Channel ID : <${userVoiceChannel.id}> RTC Region changed to Hongkong by ${i.member.displayName}`)
                return await i.update({ embeds: [embed], components: [] });
            } if(i.customId === 'automatic') {
                await userVoiceChannel.setRTCRegion(null).catch(err => console.error)
                embed.setTitle(`Set Region Success`)
                embed.setDescription(`RTC Region changed to Automatic by ${i.member.displayName}`)
                console.log(`[ Region ] Voice Channel ID : <${userVoiceChannel.id}> RTC Region changed to Automatic by ${i.member.displayName}`)
                return await i.update({ embeds: [embed], components: [] });
            } else {
                embed.setTitle(`Set Region Error`)
                embed.setDescription(`An error has occured. :(\nIf you think this is a server error please contact CrunzieL.`)
                console.log(`[ Region ] An error has occured.`)
                return i.update({ embeds: [embed], components: [] })
            }
        });
        
        collector.on('end', collected => {
            interaction.editReply({ components: [] })
            console.log(`[ Region ] Collected ${collected.size} interactions.`);
        });


     }
};