const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "invite",
    description: "Invite your friend to your table",

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
        
        //Fetch
        const fetchMessage = await interaction.channel.messages.fetch(client.textdata.get(interaction.channel.id))
        
        //kalo ada yang baca ini, gw pun gangerti gw tulis apa. makasih.
        if(!userVoiceChannel) {
            embed.setTitle(`Invite Error`)
            embed.setDescription(`You are not connected to a voice channel.`)
            return interaction.editReply({ embeds: [embed] })
        }

        if(userVoiceChannel.name.startsWith("Public")) {
            embed.setTitle(`Invite Error`)
            embed.setDescription(`You can't invite someone to Public Lounge\nPlease create a table for this feature.`)
            return interaction.editReply({ embeds: [embed] })
        }

        if(fetchMessage.embeds[0].fields[1].value !== interaction.member.id) {
            embed.setTitle(`Set Region Error`)
            embed.setDescription(`This table is not yours.\nYou only can lock your own table.\nKindly please create a table for this feature.`)
            return interaction.editReply({ embeds: [embed] })
        }

        if(interaction.channel.parentId !== interaction.member.voice.channel.parentId) {
            embed.setTitle(`Invite Error`)
            embed.setDescription(`Please use this command on your table text channel.`)
            return interaction.editReply({ embeds: [embed] })
        }

        //Loop
        const channel = interaction.guild.channels.cache.get(client.config.waitingChannel);

        if(!channel.members.size) {
            embed.setTitle(`Invite Error`)
            embed.setDescription(`There's no one inside Waiting Lounge.`)
            return interaction.editReply({ embeds: [embed] })
        }

        for (const [memberID, member] of channel.members) {
            buttons.addComponents(
				new MessageButton()
					.setCustomId(member.id)
					.setLabel(member.displayName)
					.setStyle('SECONDARY'),
			);
        }

        embed.setTitle(`Invite`)
        embed.setDescription(`Please choose a user.`)

        interaction.editReply({ embeds: [embed], components: [buttons] })

        //Collector
        const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

        collector.on('collect', async i => {
            if (interaction.guild.channels.cache.get(client.config.waitingChannel).members.has(i.customId)) {
                await interaction.guild.members.cache.get(i.customId).voice.setChannel(interaction.member.voice.channel.id).catch(err => console.error)
                embed.setTitle(`Invite`)
                embed.setDescription(interaction.guild.members.cache.get(i.customId).displayName + ` has been moved to your table.`)
                console.log(`[ Invite ] ` + interaction.guild.members.cache.get(i.customId).displayName + ` has been moved to ` + interaction.member.displayName + ` table.`)
                await i.update({ embeds: [embed], components: [] });
            } else {
                embed.setTitle(`Invite Error`)
                embed.setDescription(`The user already left :(\nIf you think this is a server error please contact CrunzieL.`)
                console.log(`[ Invite ] The user already left.`)
                interaction.editReply({ embeds: [embed], components: [] })
            }
        });
        
        collector.on('end', collected => {
            interaction.editReply({ components: [] })
            console.log(`[ Invite ] Collected ${collected.size} interactions.`);
        });

    }
};