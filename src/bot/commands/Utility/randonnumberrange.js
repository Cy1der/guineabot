module.exports = {
	name: "randomnumberrange",
	aliases: ["rnr"],
	category: "utility",
	run: async (client, message, args, prefix) => {
		if (!args[0])
			return await message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Usage",
								value: `\`\`\`${prefix}randomnumberrange <min> <max>\`\`\``,
							},
						],
					},
					message
				)
			);
		if (!args[1])
			return await message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Usage",
								value: `\`\`\`${prefix}randomnumberrange <min> <max>\`\`\``,
							},
						],
					},
					message
				)
			);

		let min = parseInt(args[0]);
		let max = parseInt(args[1]);

		if (isNaN(min))
			return await message.channel.send(
				client.embed(
					{
						title: "Please specify the minimum number as a number",
					},
					message
				)
			);
		if (isNaN(max))
			return await message.channel.send(
				client.embed(
					{
						title: "Please specify the maximum number as a number",
					},
					message
				)
			);

		let result = Math.floor(Math.random() * (max - min) + min);
		return await message.channel.send(
			client.embed(
				{ title: `From ${min} and ${max} you get \`${result}\`` },
				message
			)
		);
	},
};
