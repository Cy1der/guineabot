module.exports = {
	name: "volume",
	aliases: ["v"],
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
								name: "Current Volume",
								value: `\`\`\`${player.volume}\`\`\``,
							},
						],
					},
					message
				)
			);

		const volume = Number(args[0]);

		if (!volume || volume < 1 || volume > 100)
			return message.reply(
				client.embed(
					{ title: "Volume must be a number between 1 and 100" },
					message
				)
			);

		player.setVolume(volume);
		message.react("👍");
	},
};
