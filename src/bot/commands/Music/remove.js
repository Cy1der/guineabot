module.exports = {
	name: "remove",
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
					{ title: "Please enter a track position number" },
					message
				)
			);

		const selection = parseInt(args[0]);

		if (isNaN(selection))
			return message.channel.send(
				client.embed(
					{ title: "Please enter a numerical position number" },
					message
				)
			);
		if (selection < 1 || selection > player.queue.length)
			return message.channel.send(
				client.embed(
					{
						title: `Number must be in between 1 and ${player.queue.length}`,
					},
					message
				)
			);

		const removedTrack = player.queue.remove(selection - 1);
		return message.channel.send(
			client.embed(
				{
					title: `Track Removed`,
					fields: [
						{
							name: "Name",
							value: `\`\`\`${removedTrack[0].title}\`\`\``,
						},
					],
				},
				message
			)
		);
	},
};
