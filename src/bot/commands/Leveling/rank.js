const { MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");
module.exports = {
	name: "rank",
	aliases: ["xp"],
	category: "leveling",
	run: async (client, message, args) => {
		const target =
			message.mentions.users.first() ||
			client.users.cache.get(args[0]) ||
			message.author;
		const userStats = await client.leveling.fetch(
			target.id,
			message.guild.id
		);
		if (!userStats)
			return message.channel.send(
				client.embed(
					{
						title: `Seems like ${target.username} has not earned any XP yet...`,
					},
					message
				)
			);

		let rank;
		const rawLB = await client.leveling.fetchLeaderboard(
			message.guild.id,
			message.guild.memberCount
		);
		const leaderboard = await client.leveling.computeLeaderboard(
			client,
			rawLB,
			true
		);
		leaderboard?.forEach((data) => {
			if (data.userID === target.id) return (rank = data.position);
		});

		const rankCard = new canvacord.Rank()
			.setRequiredXP((userStats.level + 1) * (userStats.level + 1) * 100)
			.setCurrentXP(userStats.xp)
			.setAvatar(
				target.displayAvatarURL({
					format: "png",
				})
			)
			.setStatus(target.presence.status, true)
			.setProgressBar("#FFB627", "COLOR")
			.setUsername(target.username)
			.setDiscriminator(target.discriminator)
			.setLevel(userStats.level)
			.setRank(rank)
			.renderEmojis(true);

		rankCard.build().then((data) => {
			const attachment = new MessageAttachment(
				data,
				`${target.id}-${message.guild.id}-rank.png`
			);
			message.channel.send(attachment);
		});
	},
};
