module.exports = {
	name: "leaderboard",
	aliases: ["lb"],
	category: "leveling",
	run: async (client, message) => {
		const rawLB = await client.leveling.fetchLeaderboard(
			message.guild.id,
			10
		);
		const leaderboard = await client.leveling.computeLeaderboard(
			client,
			rawLB,
			true
		);
		const lbText = leaderboard.map(
			(data) =>
				`**${data.position}** - ${data.username}#${
					data.discriminator
				} - Level ${data.level} - ${data.xp.toLocaleString()} XP`
		);
		message.channel.send(
			client.embed(
				{
					title: `${message.guild.name} most active members`,
					description: lbText.join("\n"),
				},
				message
			)
		);
	},
};
