module.exports = {
	name: "bass",
	category: "music",
	botPermissions: ["CONNECT", "SPEAK"],
	run: async (client, message, args) => {
		if (!message.member.voice.channel)
			return await message.channel.send(
				client.embed(
					{
						title: "You must be connected to a voice channel!",
					},
					message
				)
			);
		if (message.guild.me.voice.channel) {
			if (
				message.guild.me.voice.channel.id !==
				message.member.voice.channel.id
			)
				return await message.channel.send(
					client.embed(
						{
							title: "I am already connected to a voice channel!",
						},
						message
					)
				);
		}
		const player = client.manager.players.get(message.guild.id);
		if (!player)
			return message.channel.send(
				client.embed(
					{
						title: "No music is being played!",
					},
					message
				)
			);

		if (!args.length)
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Available Options",
								value: `\`\`\`None, Low, Medium, High\`\`\``,
							},
						],
					},
					message
				)
			);

		const levels = {
			none: 0.0,
			low: 0.1,
			medium: 0.15,
			high: 0.25,
		};

		let level;
		if (args[0].toLowerCase() in levels) level = args[0].toLowerCase();

		const bands = new Array(3)
			.fill(null)
			.map((_, i) => ({ band: i, gain: levels[level] }));

		player.setEQ(...bands);

		return message.channel.send(
			client.embed(
				{ title: `Set the bassboost level to ${level}` },
				message
			)
		);
	},
};
