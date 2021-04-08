module.exports = {
	name: "repeat",
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

		player.setQueueRepeat(!player.queueRepeat);
		const queueRepeat = player.queueRepeat ? "Enabled" : "Disabled";
		return message.channel.send(
			client.embed({ title: `${queueRepeat} queue repeat` }, message)
		);
	},
};
