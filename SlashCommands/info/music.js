const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "music",
    description: "Show all maids and butlers status in the server",

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

      const maidStatus = async () => {

         niya = interaction.guild.members.cache.get("407170163553861632");
         mugi = interaction.guild.members.cache.get("881356777155870721");
         mashu = interaction.guild.members.cache.get("890240719636267028");

         if(niya.voice.channel) { niyaVoiceStatus = `Not Available 🚫`} else { niyaVoiceStatus = `Available :white_check_mark:` }
         if(mugi.voice.channel) { mugiVoiceStatus = `Not Available 🚫`} else { mugiVoiceStatus = `Available :white_check_mark:` }
         if(mashu.voice.channel) { mashuVoiceStatus = `Not Available 🚫`} else { mashuVoiceStatus = `Available :white_check_mark:` }

         embed.setTitle(`Music`)
         embed.setDescription(`Want to listen songs together but don't know how? We got you covered!\n\n**Make sure you summon the available maid in order not to interrupt the others.**\n
         You may check the availability in this page\n\nTo check all supported commands you can use ` + "``[prefix]musichelp``" + `\n\n**Name [Prefix]**\n\n`)
         embed.addField("Niya [!]", niyaVoiceStatus, true)
         embed.addField("Mugi [~]", mugiVoiceStatus, true)
         embed.addField("Mashu [?]", mashuVoiceStatus, true)
         embed.setImage(`https://cdn.discordapp.com/attachments/892108012179816448/892108474064961597/music_play.gif`)

         await interaction.editReply({ embeds: [embed] })
      }

         await maidStatus()

   }
};