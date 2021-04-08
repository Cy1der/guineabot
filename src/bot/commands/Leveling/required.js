module.exports = {
	name: "required",
	category: "leveling",
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed({ title: "Please enter a number" }, message)
			);
		const level = parseInt(args[0]);
		if (isNaN(level))
			return message.channel.send(
				client.embed(
					{ title: "Number must be a numerical value" },
					message
				)
			);
		const xpFor = client.leveling.xpFor(level);
		return message.channel.send(
			client.embed(
				{
					title: `You need \`${xpFor}\` XP to reach level \`${level}\``,
				},
				message
			)
		);
	},
};
