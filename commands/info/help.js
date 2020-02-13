const discord = require("discord.js");

module.exports = {
    name: "도움말",
    category: "info",
    description: "도움말을 알려줍니다.",
    run: async (client, message, args) => {

        let embed = new discord.RichEmbed()
            .setColor('#fbff00')
            .setThumbnail(client.user.avatarURL)
            .setTitle(`도움말`)
            .addField('``!신고 | @신고 할 사람 | 이유``', '신고를 할 수 있는 기능')
            .addField('``!가위바위보``', '스폰지밥과 가위바위보를 할 수 있는 기능')
            .addField('``!핑``', '현재 자신의 핑을 알수 있는 기능')
            .addField('``!음악 | 유튜브URL``', '유튜브에서 노래를 찾아 그영상에 노래를 듣는 기능 \n\n + ``노래기능은 정확한 유튜브 노래를 듣기 위해 URL로만 적어주셔야 합니다. 양해 부탁드립니다.``');

        message.channel.send(embed);
    }
};