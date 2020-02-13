const Discord = require("discord.js");

module.exports = {
    name: "공지",
    category: "moderation",
    description: "공지를 알립니다.",
    usage: "<!공지 | #채널 | 할말>",
    run: async (client, message, args) => {
        if(!message.member.hasPermission(["MANAGE_MESSAGE", "ADMINISTRATOR"])) return message.channel.send("넌 공지를 보낼 권한이 없어! 꺄하핳")

        let argsresult;
        let mChannel = message.mentions.channels.first()

        message.delete()
        if(mChannel) {
            argsresult = args.slice(1).join(" ")
            mChannel.send(argsresult)
        } else {
            argsresult = args.join(" ")
            message.channel.send(argsresult)
        }
    }

}