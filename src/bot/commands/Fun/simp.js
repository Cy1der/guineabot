module.exports = {
	name: "simp",
	category: "fun",
	run: async (client, message) => {
		message.channel.send(
			client.embed(
				{
					description: `😳 | You are ${Math.floor(
						Math.random() * 101
					)}% simp`,
				},
				message
			)
		);
	},
};
