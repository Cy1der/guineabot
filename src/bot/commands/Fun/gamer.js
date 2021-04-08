module.exports = {
	name: "gamer",
	category: "fun",
	run: async (client, message) => {
		message.channel.send(
			client.embed(
				{
					description: `🎮 | You are ${Math.floor(
						Math.random() * 101
					)}% gamer`,
				},
				message
			)
		);
	},
};
