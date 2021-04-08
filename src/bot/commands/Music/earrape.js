module.exports = {
	name: "earrape",
	category: "music",
	botPermissions: ["CONNECT", "SPEAK"],
	run: async (client, message, args, prefix) => {
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

		if (!args.length) {
			player.setEQ(
				...Array(15)
					.fill(0)
					.map((n, i) => ({ band: i, gain: 1.1 }))
			);
			return message.channel.send(
				client.embed(
					{
						title: `Done! Do \`${prefix}earrape reset\` to go back to normal.`,
					},
					message
				)
			);
		}

		if (args[0].toLowerCase() === "reset") {
			player.setEQ(
				...Array(15)
					.fill(0)
					.map((n, i) => ({ band: i, gain: 0 }))
			);
			return message.react("👍");
		}
	},
};
