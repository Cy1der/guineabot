module.exports = {
	name: "resume",
	category: "music",
	botPermissions: ["CONNECT", "SPEAK"],
	run: async (client, message) => {
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

		if (!player.paused)
			return message.channel.send(
				client.embed(
					{
						title: "Music player is already running!",
					},
					message
				)
			);
		player.pause(false);
		message.react("👍");
	},
};
