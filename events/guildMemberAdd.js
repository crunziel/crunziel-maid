const client = require("../index");
const { MessageAttachment, MessageEmbed } = require("discord.js");
const Canvas = require("canvas");
const { registerFont, createCanvas } = require('canvas')
Canvas.registerFont('./assets/Roboto-Regular.ttf', { family: 'Roboto' })

client.on("guildMemberAdd", async member => {
    //If not in a guild return
    if(!member.guild) return;
    //create a new Canvas
    const canvas = Canvas.createCanvas(1772, 633);
    //make it "2D"
    const ctx = canvas.getContext('2d');
    //set the Background to the welcome.png
    const background = await Canvas.loadImage(`./assets/welcome.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#f2f2f2';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    //set the first text string
    var textString3 = `${member.user.username}`;
    //if the text is too big then smaller the text
    if (textString3.length >= 14) {
      ctx.font = 'bold 100px "Roboto"';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString3, 720, canvas.height / 2 + 20);
    }
    //else dont do it
    else {
      ctx.font = 'bold 150px "Roboto"';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString3, 720, canvas.height / 2 + 20);
    }
    //define the Discriminator Tag
    var textString2 = `#${member.user.discriminator}`;
    ctx.font = 'bold 40px "Roboto"';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString2, 730, canvas.height / 2 + 58);
    //define the Member count
    var textString4 = `Member #${member.guild.memberCount}`;
    ctx.font = 'bold 60px "Roboto"';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString4, 750, canvas.height / 2 + 125);
    //get the Guild Name
    var textString4 = `${member.guild.name}`;
    ctx.font = 'bold 60px "Roboto"';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString4, 700, canvas.height / 2 - 150);
    //create a circular "mask"
    ctx.beginPath();
    ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true);//position of img
    ctx.closePath();
    ctx.clip();
    //define the user avatar
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
    //draw the avatar
    ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
    //get it as a discord attachment
    const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    //define the welcome embed
    const welcomeembed = new MessageEmbed()
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter(`${client.config.footerText}`, `${client.config.footerImg}`)
      .setTitle(`OKAERINASAIMASE GOSHUJINSAMA!~`)
      .addField(`Hey ${member.displayName}! Welcome to **${member.guild.name}!**`, `${member.guild.name} is a café themed discord server. Take a quick rest and enjoy music with our bots!~ We look forward to serving you and We will make sure you have a wonderful time here!~`, true)
      .setImage("attachment://welcome-image.png")
    //define the welcome channel
    const channel = member.guild.channels.cache.find(ch => ch.id === client.config.welcomeChannel);
    //send the welcome embed to there
    channel.send({ embeds: [welcomeembed], files: [attachment] } );
    //member roles add on welcome every single role
    let roles = client.config.customerRole;
    for(let i = 0; i < roles.length; i++ )
    member.roles.add(roles[i]);
  })
