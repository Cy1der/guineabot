const axios = require("axios").default;
module.exports = {
	name: "joke",
	category: "fun",
	run: async (client, message) => {
		let options = {
			url: "https://v2.jokeapi.dev/joke/Any?safe-mode?type=twopart",
			method: "GET",
		};
		axios.request(options).then(async (response) => {
			return await message.channel.send(
				client.embed(
					{
						title: `${response.data.setup}`,
						description: `||${response.data.delivery}||`,
					},
					message
				)
			);
		});
	},
};
