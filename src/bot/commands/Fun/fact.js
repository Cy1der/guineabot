const axios = require("axios").default;
module.exports = {
	name: "fact",
	category: "fun",
	run: async (client, message) => {
		axios
			.get("https://useless-facts.sameerkumar.website/api")
			.then(async (response) => {
				return await message.channel.send(
					client.embed({ title: response.data.data }, message)
				);
			});
	},
};
