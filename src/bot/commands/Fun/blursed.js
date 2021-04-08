const axios = require("axios").default;
module.exports = {
	name: "blursed",
	category: "fun",
	run: async (client, message) => {
		axios
			.get("https://www.reddit.com/r/blursedimages/random/.json")
			.then((response) => {
				let content = response.data;
				let permalink = content[0].data.children[0].data.permalink;
				let memeUrl = `https://reddit.com${permalink}`;
				let memeImage = content[0].data.children[0].data.url;
				let memeTitle = content[0].data.children[0].data.title;
				let memeUpvotes = content[0].data.children[0].data.ups;
				let memeDownvotes = content[0].data.children[0].data.downs;
				let memeNumComments =
					content[0].data.children[0].data.num_comments;

				message.channel.send(
					client
						.embed(
							{
								title: memeTitle,
								url: memeUrl,
								image: {
									url: memeImage,
								},
							},
							message
						)
						.setFooter(
							`🔼 ${memeUpvotes} 🔽 ${memeDownvotes} 💬 ${memeNumComments}`
						)
				);
			});
	},
};
