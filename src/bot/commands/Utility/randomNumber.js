module.exports = {
	name: "randomnumber",
	aliases: ["rn"],
	category: "utility",
	run: async (client, message) => {
		var determinator = Math.floor(Math.random() * 2);
		var posOrneg =
			determinator === 1
				? Number.MAX_SAFE_INTEGER
				: Number.MIN_SAFE_INTEGER;
		return message.channel.send(
			client.embed(
				{
					title: `Your number is ${Math.floor(
						Math.random() * posOrneg
					)}`,
				},
				message
			)
		);
	},
};
