const axios = require("axios").default;
const ms = require("ms");

module.exports = {
	name: "movie",
	category: "utility",
	cooldown: ms("1m"),
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed({ title: "Please enter a movie title" }, message)
			);

		const search = args.join(" ");
		const firstRequestConfig = {
			url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/${search}`,
			headers: {
				"x-rapidapi-key": client.config.bot.rapid_api_key,
				"x-rapidapi-host":
					"imdb-internet-movie-database-unofficial.p.rapidapi.com",
			},
		};

		const { data: firstResults } = await axios.request(firstRequestConfig);
		if (!firstResults.titles.length)
			return message.channel.send(
				client.embed({ title: "Movie not found" }, message)
			);

		const secondRequestConfig = {
			url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${firstResults.titles[0].id}`,
			headers: {
				"x-rapidapi-key": client.config.bot.rapid_api_key,
				"x-rapidapi-host":
					"imdb-internet-movie-database-unofficial.p.rapidapi.com",
			},
		};
		const { data: secondResults } = await axios.request(
			secondRequestConfig
		);

		let cast = [];
		for (const actor of secondResults.cast) cast.push(actor.actor);

		const technical = secondResults.technical_specs
			.map(
				(value) => `**${value[0]}:** ${value[1].replace(/<br>/g, "\n")}`
			)
			.join("\n");

		return message.channel.send(
			client.embed(
				{
					title: `${secondResults.title} (${secondResults.year})`,
					description: `**Length:** ${
						secondResults.length.length
							? secondResults.length
							: "unknown"
					}\n**Rating:** ${
						secondResults.rating.length
							? secondResults.rating
							: "unknown"
					} / 10 (${
						secondResults.rating_votes.length
							? secondResults.rating_votes
							: "unknown"
					} votes)\n\n${secondResults.plot}`,
					fields: [
						{
							name: "Cast",
							value: cast.join(", "),
						},
						{
							name: "Technical Specifications",
							value: technical,
						},
					],
					image: {
						url: secondResults.poster ?? null,
					},
				},
				message
			)
		);
	},
};
