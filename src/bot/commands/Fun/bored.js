const axios = require("axios").default;
module.exports = {
	name: "bored",
	category: "fun",
	run: async (client, message) => {
		axios.get("http://www.boredapi.com/api/activity/").then(async (res) => {
			const activity = res.data.activity;
			const type = titleCase(res.data.type);
			const participants = res.data.participants;
			const price = res.data.price * 10;
			const key = res.data.key;
			const accessibility = res.data.accessibility * 10;

			return await message.channel.send(
				client.embed(
					{
						title: "Are you bored?",
						description: `**Activity:** ${activity}\n**Type:** ${type}\n**Participants:** ${participants}\n**Price:** ${price} out of 10\n**Accessibility:** ${accessibility} out of 10`,
						footer: key,
					},
					message
				)
			);
		});
	},
};

function titleCase(str) {
	return str
		.toLowerCase()
		.split(/ +/g)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
