const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "destroy",
    description: "Move everyone to Public Lounge and Destroy the table",

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction) => {

        const embed = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()

        const buttons = new MessageActionRow()

        const embedAdmin = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()

        const buttonsAdmin = new MessageActionRow()

        //define tabledelete
        const tabledelete = async () => {
            let voiceID = client.textdata.get(interaction.channel.id).voiceID
            let guildID = client.voicedata.get(voiceID).guildID
            let textID = client.voicedata.get(voiceID).textID
            let catID = client.voicedata.get(voiceID).catID
            let memberID = client.voicedata.get(voiceID).memberID

            let channel = interaction.guild.channels.cache.get(voiceID)
            //Loop buat pindahin semua orang and let the voicestateupdate do da job ma fren
            if (channel.members.size >= 1){
                for (const [memberID, member] of channel.members) {
                    await member.voice.setChannel(client.config.publicChannel).catch(err => console.error)
                }

                return
            }

            //Misal kalo nyangkut
            if(channel.members.size === 0){
                //Delete Channels
                await client.guilds.cache.get(guildID).channels.cache.get(voiceID).delete();
                client.wait(250)
                await client.guilds.cache.get(guildID).channels.cache.get(textID).delete();
                client.wait(250)
                await client.guilds.cache.get(guildID).channels.cache.get(catID).delete();
                // Remove the channel id from the temporary channels set
                await client.textdata.delete(textID); //delete textdata
                await client.memberdata.delete(memberID); //delete memberdata
                return client.voicedata.delete(voiceID); //delete voicedata
            }

        }

        //admin and owner
        if(interaction.member.id === client.config.ownerID && client.textdata.has(interaction.channel.id)) {
            
            //embed and buttons
            embedAdmin.setTitle(`Destroy Table`)
            embedAdmin.setDescription(`Are you sure ? \n\nYou will delete **${interaction.channel.parent.name}** \n\nI will move everyone to Public Lounge and clean the table.`)
                    
            buttonsAdmin.addComponents(
                new MessageButton()
                    .setCustomId(`destroy-admin`)
                    .setLabel(`Yes`)
                    .setStyle('DANGER'),
            );
            
            buttonsAdmin.addComponents(
                new MessageButton()
                    .setCustomId(`no-admin`)
                    .setLabel(`No`)
                    .setStyle('SECONDARY'),
            );
                    
            await interaction.editReply({ embeds: [embedAdmin], components: [buttonsAdmin] })

            //Collector
            const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'destroy-admin') {
                    embed.setTitle(`Destroy Success`)
                    embed.setDescription(`I will delete ${interaction.channel.parent.name} in 2 seconds. Have a good day!`)
                    await client.wait(1000)
                    await i.update({ embeds: [embed], components: [] });
                    await client.wait(2000)
                    await tabledelete();
                } if (i.customId === 'no-admin') {
                    embed.setTitle(`Destroy`)
                    embed.setDescription(`Oh, you changed ur mind eh?`)
                    await client.wait(1000)
                    return interaction.editReply({ embeds: [embed], components: [] })
                } 
            })
            
            collector.on('end', collected => {
                return
            });

            return
        }

        //user
        if(!client.memberdata.has(interaction.member.id)) {
            embed.setTitle(`Destroy Error`)
            embed.setDescription(`You currently don't have active table.\nKindly please create a table for this feature.`)
            return interaction.editReply({ embeds: [embed] })
        }

        //*
        if(interaction.channel.id !== client.voicedata.get(client.memberdata.get(interaction.member.id)).textID) {
            embed.setTitle(`Destroy Error`)
            embed.setDescription(`Please use this command on your table text channel.`)
            return interaction.editReply({ embeds: [embed] })
        } 

        const fetchMessage = await interaction.channel.messages.fetch(client.textdata.get(interaction.channel.id).messageID)

        if(fetchMessage.embeds[0].fields[1].value !== interaction.member.id) {
            embed.setTitle(`Destroy Error`)
            embed.setDescription(`This table is not yours.\nYou only can destroy your own table.\nKindly please create a table for this feature.`)
            return interaction.editReply({ embeds: [embed] })
        }

        
        if (interaction.channel.id === client.voicedata.get(client.memberdata.get(interaction.member.id)).textID) {       
        embed.setTitle(`Destroy Table`)
        embed.setDescription(`Are you sure ?\nI will move everyone to Public Lounge and clean your table.`)
        
        buttons.addComponents(
            new MessageButton()
                .setCustomId(`destroy`)
                .setLabel(`Yes`)
                .setStyle('DANGER'),
        );

        buttons.addComponents(
            new MessageButton()
                .setCustomId(`no`)
                .setLabel(`No`)
                .setStyle('SECONDARY'),
        );
        
        interaction.editReply({ embeds: [embed], components: [buttons] })
        }

        //Collector
        const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'destroy') {
                await client.wait(1000)
                embed.setTitle(`Destroy Success`)
                embed.setDescription(`Hey ${interaction.member.displayName}!, I will clean up your table in 10 seconds.\nThanks for visiting ${interaction.guild.name}!\nIt is our goal that you are always happy here\nSo please let CrunzieL know if you have any issues.\n\nMuch loveee to you!`)
                await i.update({ embeds: [embed], components: [] });
                await client.wait(10000)
                await tabledelete();
            } if (i.customId === 'no') {
                embed.setTitle(`Destroy`)
                embed.setDescription(`Hey~ You changed your mind!\nPlease do tell me if you need anything else.\n\nEnjoy your visit!`)
                await client.wait(1000)
                await interaction.update({ embeds: [embed], components: [] })
            }
        });
        
        collector.on('end', collected => {
            return
        });
    }
};