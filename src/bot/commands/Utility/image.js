const cheerio = require("cheerio");
const request = require("request");
module.exports = {
	name: "image",
	category: "utility",
	aliases: ["i"],
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed({ title: "Please enter a search query" }, message)
			);
		image(message, client, args.join(" "));
	},
};

function image(message, client, query) {
	let options = {
		url: "http://results.dogpile.com/serp?qc=images&q=" + query,
		method: "GET",
		headers: {
			Accept: "text/html",
			"User-Agent": "Chrome",
		},
	};

	request(options, async function (error, response, responseBody) {
		if (error) return;

		let $ = cheerio.load(responseBody);

		let links = $(".image a.link");
		let urls = new Array(links.length)
			.fill(0)
			.map((v, i) => links.eq(i).attr("href"));

		if (!urls.length) return;

		return await message.channel.send(
			client
				.embed(
					{ title: `Showing search result for "${query}"` },
					message
				)
				.setImage(urls[Math.floor(Math.random() * urls.length)])
		);
	});
}
