const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "discordinvite",
    description: "Show an invite link to this server",

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const inviteLink = new MessageEmbed()
        .setColor(`${client.config.embedColor}`)
        .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
        .setTimestamp()
        .setDescription(`Hey <@${interaction.member.id}>! Thanks for making this server bigger! Here's the invite link`)

        await interaction.editReply({ embeds: [inviteLink] })
        return await interaction.followUp({ content: 'https://discord.gg/bWRzRqp2WW', ephemeral: true });
    }
};