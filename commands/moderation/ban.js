const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "밴",
    category: "moderation",
    description: "유저를 밴 시킵니다.",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "로그") || message.channel;

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("밴 시킬 사람을 알려주십시오.")
                .then(m => m.delete(5000));
        }

        // No reason
        if (!args[1]) {
            return message.reply("밴 시키는 이유를 알려주십시오.")
                .then(m => m.delete(5000));
        }

        // No author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ 당신은 관리자 권한이 없습니다.")
                .then(m => m.delete(5000));
        
        }
        // No bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ 봇에게 관리자 권한을 부여하십시오.")
                .then(m => m.delete(5000));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toBan) {
            return message.reply("그 유저를 찾을 수 없습니다. 다시 시도하십시오.")
                .then(m => m.delete(5000));
        }

        // Can't ban urself
        if (toBan.id === message.author.id) {
            return message.reply("자신을 밴 시킬수 없습니다.")
                .then(m => m.delete(5000));
        }

        // Check if the user's banable
        if (!toBan.bannable) {
            return message.reply("그 사람은 관리자 권한이 있으므로 밴 시킬수 없습니다.")
                .then(m => m.delete(5000));
        }
        
        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> 밴 당한 유저:** ${toBan} (${toBan.id})
            **> 밴 시킨 사람:** ${message.member} (${message.member.id})
            **> 이유:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("#993333")
            .setAuthor(`30초 안에 이모지를 클릭하십시오.`)
            .setDescription(`이 사람을 킥할 것인가요? ${toBan}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();

                toBan.ban(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`오류 ${err}`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply('밴이 취소되었습니다.')
                    .then(m => m.delete(10000));
            }
        });
    }
};