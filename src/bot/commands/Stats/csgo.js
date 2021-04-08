const axios = require("axios").default;
const ms = require("ms");
const steamAPI = require("steamapi");
module.exports = {
	name: "csgo",
	category: "statistics",
	//cooldown: ms("1m"),
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "Please enter a Steam Username" },
					message
				)
			);
		const username = args.join(" ");
		const steam = new steamAPI(client.config.bot.steam_token);
		let ID;

		try {
			ID = await steam.resolve(
				`https://steamcommunity.com/id/${username}`
			);
		} catch (e) {
			return message.channel.send(
				client.embed(
					{ title: `Player ${username} not found on Steam` },
					message
				)
			);
		}

		const config = {
			url: `https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${ID}`,
			responseType: "json",
			headers: {
				"TRN-Api-Key": client.config.bot.TRN_api_key,
			},
		};

		axios
			// @ts-ignore
			.request(config)
			.then(async (response) => {
				let allData = response.data.data;
				let stats = Object.values(allData.segments[0].stats).sort(
					(a, b) => {
						let propertyA = a.category;
						let propertyB = b.category;
						return propertyA < propertyB
							? -1
							: propertyA > propertyB
							? 1
							: 0;
					}
				);

				let userInfo = `Prime? ${
					allData.userInfo.isPremium ? "Yes" : "No"
				}\nVerified? ${
					allData.userInfo.isVerified ? "Yes" : "No"
				}\nInfluencer? ${
					allData.userInfo.isInfluencer ? "Yes" : "No"
				}\nPartnered? ${allData.userInfo.isPartner ? "Yes" : "No"}`;

				let general = "";
				let combat = "";
				let round = "";
				let objective = "";

				for (let i = 0; i < stats.length; i++) {
					if (stats[i].category === "combat")
						combat += `${stats[i].displayName}: ${stats[i].displayValue}\n`;
					if (stats[i].category === "general")
						general += `${stats[i].displayName}: ${stats[i].displayValue}\n`;
					if (stats[i].category === "objective")
						objective += `${stats[i].displayName}: ${stats[i].displayValue}\n`;
					if (stats[i].category === "round")
						round += `${stats[i].displayName}: ${stats[i].displayValue}\n`;
				}

				return await message.channel.send(
					client.embed(
						{
							title: `Showing lifetime stats for ${username}`,
							description: userInfo,
							fields: [
								{
									name: "Combat",
									value: combat,
									inline: true,
								},
								{
									name: "Round",
									value: round,
									inline: true,
								},
								{
									name: "Objective",
									value: objective,
									inline: true,
								},
								{
									name: "General",
									value: general,
									inline: true,
								},
							],
						},
						message
					)
				);
			});
	},
};
