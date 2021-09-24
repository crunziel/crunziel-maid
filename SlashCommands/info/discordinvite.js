const { Client, CommandInteraction } = require("discord.js");

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
        interaction.editReply(`Hey <@${interaction.member.id}>! Thanks for making this server bigger! Here's the invite link`)
        return interaction.followUp({ content: 'https://discord.gg/bWRzRqp2WW', ephemeral: true });
    }
};