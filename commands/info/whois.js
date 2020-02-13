const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");

module.exports = {
    name: "정보",
    aliases: ["who", "user", "info"],
    description: "유저에 정보를 메시지로 전송합니다",
    usage: "[username | id | mention]",
    run: (client, message, args) => {
        const member = getMember(message, args.join(" "));

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';

        // User variables
        const created = formatDate(member.user.createdAt);

        const embed = new RichEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('유저 서버 정보:', stripIndents`**- 디스코드 닉네임:** ${member.displayName}
            **- 서버에 들어온 날짜:** ${joined}
            **- 역할:** ${roles}`, true)

            .addField('유저 정보:', stripIndents`**- ID:** ${member.user.id}
            **- 디스코드 닉네임**: ${member.user.username}
            **- 디스코드 테그**: ${member.user.tag}
            **- 계정 생성 날짜**: ${created}`, true)
            
            .setTimestamp()

        if (member.user.presence.game) 
            embed.addField('플레이', stripIndents`${member.user.presence.game.name}`);

        message.channel.send(embed);
    }
}