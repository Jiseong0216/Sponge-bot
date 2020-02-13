const { RichEmbed } = require("discord.js");
const { promptMessage } = require("../../functions.js");

const chooseArr = ["✌", "👊", "🖐"];

module.exports = {
    name: "가위바위보",
    category: "fun",
    description: "가위바위보 게임!",
    usage: "rps",
    run: async (client, message, args) => {
        const embed = new RichEmbed()
            .setColor("#ffffff")
            .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
            .setDescription("가위.. 바위..")
            .setTimestamp();

        const m = await message.channel.send(embed);
        const reacted = await promptMessage(m, message.author, 30, chooseArr);

        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

        const result = await getResult(reacted, botChoice);
        await m.clearReactions();

        embed
            .setDescription("")
            .addField(result, `${reacted} vs ${botChoice}`);

        m.edit(embed);

        function getResult(me, clientChosen) {
            if ((me === "✌" && clientChosen === "🖐") ||
                (me === "👊" && clientChosen === "✌") ||
                (me === "🖐" && clientChosen === "👊")) {
                    return "보! 엇 제가 졌네요..ㅠㅠ";
            } else if (me === clientChosen) {
                return "보! 어라? 무승부네요";
            } else {
                return "보! 와 제가 이겼어요!";
            }
        }
    }
}