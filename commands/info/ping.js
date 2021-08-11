const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    /**
     *
     * @param {Client} client
     */
    run: async (client) => {
        const embed = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .addField('Pinging ...', `My Latency is : ... ms.\nMy API Latency is : ... ms.`, true);
        const resMsg = await message.channel.send({ embeds: [embed] });

        const resEmbed = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .addFields({name: 'Pong!', value: `My Latency is : ${Math.round(resMsg.createdTimestamp - message.createdTimestamp)} ms .\nMy API Latency is : ${Math.round(client.ws.ping)} ms`, inline: true},);
        resMsg.edit({ embeds: [resEmbed] });
    }
}