module.exports = {
	name: "switch",
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

		if (!args.length || args.length < 2)
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Usage",
								value: `\`\`\`${prefix}switch <from> <to>\`\`\``,
							},
						],
					},
					message
				)
			);

		const from = parseInt(args[0]);
		const to = parseInt(args[1]);

		if (isNaN(from) || isNaN(to))
			return message.channel.send(
				client.embed(
					{
						title: "From and To need to be a numerical value",
					},
					message
				)
			);

		player.queue.switch(from, to);
		message.react("👍");
	},
};
