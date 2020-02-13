module.exports = {
    name: "핑",
    category: "info",
    description: "Returns latency and API ping",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 핑..`);

        msg.edit(`🏓 퐁!\n너의 핑은 ${Math.round(client.ping)}ms!`);
    }
}