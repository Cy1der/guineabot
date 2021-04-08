// @ts-nocheck
const cleverbot = require("cleverbot-free");
module.exports = {
	name: "cleverbot",
	category: "fun",
	aliases: ["clever"],
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "Please say something to cleverbot" },
					message
				)
			);
		return await cleverbot(args.join(" ")).then(async (response) => {
			return await message.channel.send(
				client.embed({ description: response }, message)
			);
		});
	},
};
