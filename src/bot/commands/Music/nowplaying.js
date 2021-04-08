const prettyms = require("pretty-ms");
module.exports = {
	name: "nowplaying",
	aliases: ["np"],
	category: "music",
	botPermissions: ["CONNECT", "SPEAK"],
	run: async (client, message) => {
		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.queue.current)
			return message.channel.send(
				client.embed(
					{
						title: "No music is being played!",
					},
					message
				)
			);

		return message.channel.send(
			client.embed(
				{
					title: "Current Track",
					description: `**Track:** ${
						player.queue.current.title
					}\n**Author:** ${
						player.queue.current.author
					}\n**Duration:** ${
						player.queue.current.isStream
							? "Live"
							: prettyms(player.queue.current.duration, {
									verbose: true,
									separateMilliseconds: true,
									formatSubMilliseconds: true,
									secondsDecimalDigits: 0,
							  })
					}`,
					thumbnail: {
						url: player.queue.current.thumbnail,
					},
					url: player.queue.current.uri,
				},
				message
			)
		);
	},
};
