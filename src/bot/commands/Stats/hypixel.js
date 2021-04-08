const ms = require("ms");
const prettyms = require("pretty-ms");
const hypixelAPI = require("hypixel-api-reborn");
module.exports = {
	name: "hypixel",
	category: "statistics",
	// cooldown: ms("30s"),
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "Please enter a Minecraft username" },
					message
				)
			);
		const hypixel = new hypixelAPI.Client(
			client.config.bot.hypixel_api_key,
			{
				cache: true,
			}
		);
		const username = args.join(" ");
		let userData;
		try {
			userData = await hypixel.getPlayer(username, {
				guild: true,
			});

			const commonData = {
				prevNames: [
					userData.history.join(", "),
					userData.history.length,
				],
				rank: userData.rank,
				mcVer: userData.mcVersion ?? "Unknown",
				recentGame: titleCase(
					userData.recentlyPlayedGame?.code ?? "Unknown"
				),
				level: userData.level,
				EXP: userData.totalExperience,
				achievementPoints: userData.achievementPoints,
				karma: userData.karma,
				socials:
					userData.socialMedia.length > 0
						? userData.socialMedia
								.map((value) => {
									return `[\`${value.name}\`](${value.link})`;
								})
								.join(", ")
						: "None",
			};

			const timestamps = {
				firstLogin: [
					new Date(userData.firstLogin).toDateString(),
					`${prettyms(Date.now() - userData.firstLoginTimestamp, {
						verbose: true,
						unitCount: 2,
					})} ago`,
				],
				lastLogin: [
					new Date(userData.lastLogin).toDateString(),
					`${prettyms(Date.now() - userData.lastLoginTimestamp, {
						verbose: true,
						unitCount: 3,
					})} ago`,
				],
				lastLogoff: [
					new Date(userData.lastLogout).toDateString(),
					`${prettyms(Date.now() - userData.lastLogoutTimestamp, {
						verbose: true,
						unitCount: 3,
					})} ago`,
				],
			};

			const guild = {
				name: userData.guild?.name,
				games: userData.guild?.preferredGames
					? userData.guild?.preferredGames
							.map((value) => {
								return ` ${titleCase(
									value.code.replace(/_/g, " ")
								)}`;
							})
							.join(", ")
					: "Unknown",
				desc: userData.guild?.description ?? "Unknown",
				level: userData.guild?.level,
				memberCount: userData.guild?.members.length,
			};

			return message.channel.send(
				client.embed(
					{
						title: `${userData.nickname} (${
							userData.isOnline ? "Online" : "Offline"
						})`,
						thumbnail: {
							url: `https://crafatar.com/renders/head/${userData.uuid}.png`,
						},
						description: `**Previous Names (${commonData.prevNames[1]}): **${commonData.prevNames[0]}\n**Rank: **${commonData.rank}\n**MC Version: **${commonData.mcVer}\n**Recently Played: **${commonData.recentGame}\n**Level: **${commonData.level}\n**EXP: **${commonData.EXP}\n**Achievement Points: **${commonData.achievementPoints}\n**Karma: **${commonData.karma}`,
						fields: [
							{
								name: "Linked Socials",
								value: commonData.socials,
							},
							{
								name: "Timestamps",
								value: `**First Login: **${timestamps.firstLogin[0]} (${timestamps.firstLogin[1]})\n**Last Login: **${timestamps.lastLogin[0]} (${timestamps.lastLogin[1]})\n**Last Logoff: **${timestamps.lastLogoff[0]} (${timestamps.lastLogoff[1]})`,
							},
							{
								name: "Guild",
								value: userData.guild
									? `**Name: **${guild.name}\n**Description: **${guild.desc}\n**Preferred Games: **${guild.games}\n**Level: **${guild.level}\n**Member Count: **${guild.memberCount}`
									: "None",
							},
						],
					},
					message
				)
			);
		} catch (error) {
			client.logger.error(error);
			return message.channel.send(
				client.embed(
					{
						title: "An error occurred!",
						fields: [
							{ name: "Message", value: `\`${error.message}\`` },
						],
					},
					message
				)
			);
		}
	},
};

function titleCase(str) {
	return str
		.toLowerCase()
		.split(/ +/g)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
