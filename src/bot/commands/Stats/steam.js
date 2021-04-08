const prettyms = require("pretty-ms");
const bin = require("sourcebin_js");
const ms = require("ms");
module.exports = {
	name: "steam",
	category: "statistics",
	cooldown: ms("30s"),
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "Please enter the Steam username!" },
					message
				)
			);

		const username = args.join(" ");
		let ID, userDetails, userGames, userLevel;

		try {
			ID = await client.steam.resolve(
				`https://steamcommunity.com/id/${username}`
			);
			userDetails = await client.steam.getUserSummary(ID);
			userGames = await client.steam.getUserOwnedGames(ID);
			userLevel = await client.steam.getUserLevel(ID);

			const dateCreated = [
				new Date(userDetails.created * 1000).toDateString(),
				`${prettyms(
					new Date(Date.now()).getTime() -
						new Date(userDetails.created * 1000).getTime(),
					{
						verbose: true,
						unitCount: 3,
					}
				)} ago`,
			];
			const lastOnline = [
				new Date(userDetails.lastLogOff * 1000).toDateString(),
				`${prettyms(
					new Date(Date.now()).getTime() -
						new Date(userDetails.lastLogOff * 1000).getTime(),
					{
						verbose: true,
						unitCount: 3,
					}
				)} ago`,
			];

			const ownedGames = [
				await bin
					.create(
						[
							{
								name: "GuineaBot/Cy1der",
								content: userGames
									.map((game) => game.name)
									.join("\n"),
								languageId: "Text",
							},
						],
						{
							title: `${userDetails.nickname}'s owned games`,
							description: "steam is for gamers",
						}
					)
					.then((bin) => {
						return bin.url;
					}),
				userGames.length,
			];

			return message.channel.send(
				client.embed(
					{
						title: `${userDetails.nickname} (${
							userDetails.realName ?? "unknown"
						})`,
						url: userDetails.url,
						thumbnail: { url: userDetails.avatar.large },
						description: `[Owned Games (${ownedGames[1]})](${ownedGames[0]})`,
						fields: [
							{
								name: "Last Log Off",
								value: `${lastOnline[0]} (${lastOnline[1]})`,
							},
							{
								name: "Account Creation Date",
								value: `${dateCreated[0]} (${dateCreated[1]})`,
							},
							{
								name: "Location Information",
								value: `**Country Code:** ${
									userDetails.countryCode ?? "unknown"
								}\n**Province/State Code:** ${
									userDetails.stateCode ?? "unknown"
								}\n**City ID:** ${
									userDetails.cityID ?? "unknown"
								}`,
							},
						],
					},
					message
				)
			);
		} catch (error) {
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
