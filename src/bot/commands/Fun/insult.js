const axios = require("axios").default;
module.exports = {
	name: "insult",
	category: "fun",
	run: async (client, message, args) => {
		let options = {
			method: "GET",
			url:
				"https://evilinsult.com/generate_insult.php?lang=en&amp;type=json",
		};

		axios.request(options).then(async (response) => {
			const insult = args.length
				? `${args.join(" ")}, ${response.data}`
				: response.data;
			return await message.channel.send(
				client.embed({ description: insult }, message)
			);
		});
	},
};
