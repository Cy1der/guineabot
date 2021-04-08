module.exports = {
	name: "ping",
	category: "information",
	aliases: ["pong"],
	run: async (client, message) => {
		const msg = await message.channel.send(
			client.embed(
				{
					description: "📶 Pinging...",
					title: "Discord Gateway Ping in Progress",
				},
				message
			)
		);

		await msg.edit(
			client.embed(
				{
					description: `Websocket: ${
						client.ws.ping
					} ms\nMessage Edit: ${
						msg.createdTimestamp - message.createdTimestamp
					} ms`,
					title: "Discord Gateway Ping Complete",
				},
				message
			)
		);
	},
};
