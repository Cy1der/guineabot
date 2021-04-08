module.exports = {
	name: "cool",
	category: "fun",
	run: async (client, message) => {
		message.channel.send(
			client.embed(
				{
					description: `😎 | You are ${Math.floor(
						Math.random() * 101
					)}% cool`,
				},
				message
			)
		);
	},
};
