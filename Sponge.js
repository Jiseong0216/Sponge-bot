const { Client, RichEmbed, Collection } = require("discord.js");
const { config }= require("dotenv");
const fs = require("fs");
const ytdl = require('ytdl-core');
const streamOptions = {
    seek: 0,
    volume: 1
};

const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`${client.user.username} login`);

    client.user.setPresence({
        status: "online",
        game: {
            name: "'!도움말'을 쳐 도움말을 확인해줘!",
            type: "WATCHING"
        }
    });
});

client.on("message", async message => {
    const prefix = "!";

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command)
        command.run(client, message, args);
});

var musicUrls = [];

client.on('message', async message => {
    
    if(message.author.bot)
        return;

    if(message.content.toLowerCase().startsWith("!음악"))
    {
        let args = message.content.split(" ");
        let url = args[1];
        let voiceChannel = message.guild.channels.find(channel => channel.id === '677396053313716224');

        if(ytdl.validateURL(url))
        {
            console.log("Please URL");
            var flag = musicUrls.some(element => element === url);
            if(!flag)
            {
                musicUrls.push(url);
                if(voiceChannel != null)
                {

                    if(voiceChannel.connection)
                    {
                        console.log("채널이 있습니다.");
                        const embed = new RichEmbed()
                            .setAuthor(client.user.username, client.user.displayAvatarURL)
                            .setDescription("성공적으로 노래를 재생목록에 추가했어요!");
                            
                        return channel.send(embed);

                    }
                    else {
                        try {
                            const voiceConnection = await voiceChannel.join();
                            await playSong(message.channel, voiceConnection, voiceChannel);
                        }
                        catch(ex)
                        {
                            console.log(ex);
                        }
                    }
                }
            }
        }
    }
});

async function playSong(messageChannel, voiceConnection, voiceChannel)
{
    const stream = ytdl(musicUrls[0], { filter : "audioonly"});
    const dispatcher = voiceConnection.playStream(stream, streamOptions);

    dispatcher.on('end', () => {
        musicUrls.shift();

        if(musicUrls.length == 0)
            voiceChannel.leave();
        else
        {
            setTimeout(() => {
                playSong(messageChannel, voiceConnection, voiceChannel);
            }, 5000);
        }
    });
}

client.login(process.env.TOKEN);