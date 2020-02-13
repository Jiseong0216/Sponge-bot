const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "신고",
    category: "moderation",
    description: "Reports a member",
    usage: "<mention, id>",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!rMember)
            return message.reply("해당 유저를 찾을 수 없습니다.").then(m => m.delete(5000));

        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send("해당 유저를 신고 할 수 없습니다.").then(m => m.delete(5000));

        if (!args[1])
            return message.channel.send("신고를 하는 이유를 알려주세요.").then(m => m.delete(5000));
        
        const channel = message.guild.channels.find(c => c.name === "신고")
            
        if (!channel)
            return message.channel.send("`#신고` 라는 방을 찾을 수 없습니다.").then(m => m.delete(5000));

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("신고", rMember.user.displayAvatarURL)
            .setDescription(stripIndents`**> 신고 당한 유저:** ${rMember} (${rMember.user.id})
            **> 신고 한 유저:** ${message.member}
            **> 신고 한 장소:** ${message.channel}
            **> 이유:** ${args.slice(1).join(" ")}`);

        return channel.send(embed);
    }
}