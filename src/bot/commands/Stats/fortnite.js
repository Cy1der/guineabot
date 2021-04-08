const axios = require("axios").default;
module.exports = {
	name: "fortnite",
	category: "statistics",
	run: async (client, message, args, prefix) => {
		if (!args.length || args.length < 2)
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Usage",
								value: `\`\`\`${prefix}fortnite <xbl, psn, or epic> <username>\`\`\``,
							},
						],
					},
					message
				)
			);

		const username = args.slice(1).join(" ");
		const options = ["xbl", "psn", "epic"];

		if (options.indexOf(args[0].toLowerCase()) === -1)
			return await message.channel.send(
				client.embed(
					{ title: "Invalid platform (xbl, psn, or epic)" },
					message
				)
			);

		const config = {
			url: "https://fortnite-api.com/v1/stats/br/v2",
			responseType: "json",
			params: {
				accountType: options[options.indexOf(args[0].toLowerCase())],
				timeWindow: "lifetime",
				name: username,
			},
		};

		axios
			// @ts-ignore
			.request(config)
			.then(async (response) => {
				const allData = response.data.data;
				const battlePassStr = `Level: ${allData.battlePass.level}\nProgress: ${allData.battlePass.progress}`;

				const total = allData.stats.all.overall
					? `Score: ${allData.stats.all.overall.score}\nWins: ${
							allData.stats.all.overall.wins
					  }\nKills: ${allData.stats.all.overall.kills}\nDeaths: ${
							allData.stats.all.overall.deaths
					  }\nK/D Ratio: ${
							allData.stats.all.overall.kd
					  }\nMatches Played: ${
							allData.stats.all.overall.matches
					  }\nMinutes Played: ${
							allData.stats.all.overall.minutesPlayed
					  }\n\nLast Updated: ${new Date(
							Date.parse(allData.stats.all.overall.lastModified)
					  ).toDateString()}`
					: "Unknown";

				const solo = allData.stats.all.solo
					? `Score: ${allData.stats.all.solo.score}\nWins: ${
							allData.stats.all.solo.wins
					  }\nKills: ${allData.stats.all.solo.kills}\nDeaths: ${
							allData.stats.all.solo.deaths
					  }\nK/D Ratio: ${
							allData.stats.all.solo.kd
					  }\nMatches Played: ${
							allData.stats.all.solo.matches
					  }\nMinutes Played: ${
							allData.stats.all.solo.minutesPlayed
					  }\n\nLast Updated: ${new Date(
							Date.parse(allData.stats.all.solo.lastModified)
					  ).toDateString()}`
					: "Unknown";

				const duo = allData.stats.all.duo
					? `Score: ${allData.stats.all.duo.score}\nWins: ${
							allData.stats.all.solo.wins
					  }\nKills: ${allData.stats.all.duo.kills}\nDeaths: ${
							allData.stats.all.solo.deaths
					  }\nK/D Ratio: ${
							allData.stats.all.duo.kd
					  }\nMatches Played: ${
							allData.stats.all.duo.matches
					  }\nMinutes Played: ${
							allData.stats.all.duo.minutesPlayed
					  }\n\nLast Updated: ${new Date(
							Date.parse(allData.stats.all.duo.lastModified)
					  ).toDateString()}`
					: "Unknown";

				const trio = allData.stats.all.trio
					? `Score: ${allData.stats.all.trio.score}\nWins: ${
							allData.stats.all.trio.wins
					  }\nKills: ${allData.stats.all.trio.kills}\nDeaths: ${
							allData.stats.all.trio.deaths
					  }\nK/D Ratio: ${
							allData.stats.all.trio.kd
					  }\nMatches Played: ${
							allData.stats.all.trio.matches
					  }\nMinutes Played: ${
							allData.stats.all.trio.minutesPlayed
					  }\n\nLast Updated: ${new Date(
							Date.parse(allData.stats.all.trio.lastModified)
					  ).toDateString()}`
					: "Unknown";

				const squad = allData.stats.all.squad
					? `Score: ${allData.stats.all.squad.score}\nWins: ${
							allData.stats.all.squad.wins
					  }\nKills: ${allData.stats.all.squad.kills}\nDeaths: ${
							allData.stats.all.squad.deaths
					  }\nK/D Ratio: ${
							allData.stats.all.squad.kd
					  }\nMatches Played: ${
							allData.stats.all.squad.matches
					  }\nMinutes Played: ${
							allData.stats.all.squad.minutesPlayed
					  }\n\nLast Updated: ${new Date(
							Date.parse(allData.stats.all.squad.lastModified)
					  ).toDateString()}`
					: "Unknown";

				const ltm = allData.stats.all.ltm
					? `Score: ${allData.stats.all.ltm.score}\nWins: ${
							allData.stats.all.ltm.wins
					  }\nKills: ${allData.stats.all.ltm.kills}\nDeaths: ${
							allData.stats.all.ltm.deaths
					  }\nK/D Ratio: ${
							allData.stats.all.ltm.kd
					  }\nMatches Played: ${
							allData.stats.all.ltm.matches
					  }\nMinutes Played: ${
							allData.stats.all.ltm.minutesPlayed
					  }\n\nLast Updated: ${new Date(
							Date.parse(allData.stats.all.ltm.lastModified)
					  ).toDateString()}`
					: "Unknown";

				return await message.channel.send(
					client.embed(
						{
							title: `Showing lifetime stats for ${username}`,
							fields: [
								{
									name: "Battle Pass",
									value: battlePassStr,
								},
								{
									name: "Total",
									value: total,
									inline: true,
								},
								{
									name: "Solo",
									value: solo,
									inline: true,
								},
								{
									name: "Duo",
									value: duo,
									inline: true,
								},
								{
									name: "Trio",
									value: trio,
									inline: true,
								},
								{
									name: "Squad",
									value: squad,
									inline: true,
								},
								{
									name: "Limited Time Mode",
									value: ltm,
									inline: true,
								},
							],
						},
						message
					)
				);
			})
			.catch(async (error) => {
				return message.channel.send(
					client.embed(
						{
							title: "Player not found",
						},
						message
					)
				);
			});
	},
};
