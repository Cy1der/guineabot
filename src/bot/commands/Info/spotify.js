const prettyMs = require("pretty-ms");
module.exports = {
	name: "spotify",
	category: "information",
	run: async (client, message, args) => {
		const target =
			message.mentions.members.first() ??
			message.guild.members.cache.find((user) => user.id === args[0]) ??
			message.member;
		const status = target.presence.activities.find(
			(status) => status.name.toLowerCase() == "spotify"
		);

		if (!status)
			return await message.channel.send(
				client.embed(
					{
						title: `${target.user.username} is not listening to Spotify.`,
					},
					message
				)
			);

		return await message.channel.send(
			client.embed(
				{
					title: `${target.user.username}'s Spotify Status`,
					url: `https://open.spotify.com/track/${status.syncID}`,
					thumbnail: {
						url: `https://i.scdn.co/image/${status.assets.largeImage?.slice(
							8
						)}`,
					},
					fields: [
						{
							name: "Track",
							value: status.details ?? "Nothing found :/",
						},
						{
							name: "Author(s)",
							value: status.state
								? status.state.replace(/\;/g, ",")
								: "Nothing found :/",
						},
						{
							name: "Album",
							value:
								status.assets?.largeText ?? "Nothing found :/",
						},
						{
							name: "Duration",
							value: status.timestamps
								? prettyMs(
										status.timestamps?.end -
											status.timestamps?.start,
										{
											verbose: true,
											secondsDecimalDigits: 0,
										}
								  )
								: "Nothing found :/",
						},
					],
				},
				message
			)
		);
	},
};
