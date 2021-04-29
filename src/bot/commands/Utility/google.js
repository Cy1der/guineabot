const ms = require("ms");
const axios = require("axios").default;
module.exports = {
	name: "google",
	category: "utility",
	cooldown: ms("1m"),
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{
						title: "Please enter a search query",
					},
					message
				)
			);

		const search = args.join(" ");

		const request = {
			url: "https://www.googleapis.com/customsearch/v1",
			params: {
				key: client.config.bot.google_api_key,
				cx: client.config.bot.google_csx,
				q: search,
				safe: "off",
			},
		};

		const { data: results } = await axios.request(request);

		if (!results.items)
			return message.channel.send(
				client.embed(
					{ title: "No results were found on Google!" },
					message
				)
			);
		return message.channel.send(
			client.embed(
				{
					title: results.items[0].title,
					author: {
						name: `${
							results.searchInformation.formattedTotalResults
						} results in ${results.searchInformation.searchTime.toFixed(
							2
						)} seconds`,
					},
					description: results.items[0].snippet,
					url: results.items[0].link,
					image: {
						url: results.items[0]?.pagemap?.cse_image[0]?.src,
					},
				},
				message
			)
		);
	},
};
