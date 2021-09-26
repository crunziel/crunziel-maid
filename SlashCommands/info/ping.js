const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Returns websocket ping",

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const pingingEmbed = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .addField('Pinging ...', `My Latency is : ... ms.\nMy API Latency is : ... ms.`, true);
        const resMsg = await interaction.editReply({ embeds: [pingingEmbed] });

        const pingEmbed = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .addFields({name: 'Pong!', value: `My Latency is : ${Math.round(resMsg.createdTimestamp - interaction.createdTimestamp)} ms .\nMy API Latency is : ${Math.round(client.ws.ping)} ms`, inline: true},);        

        await interaction.editReply({ embeds: [pingEmbed] })
    },
};