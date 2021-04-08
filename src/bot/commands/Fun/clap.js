module.exports = {
	name: "clap",
	category: "fun",
	run: async (client, message, args) => {
		if (!args.length)
			return await message.channel.send(
				client.embed(
					{ title: "Please input some text to add some 👏s to" },
					message
				)
			);
		return await message.channel.send(
			client.embed(
				{
					description:
						args.slice(0).join(" ").replace(/\s/g, " 👏 ").length <
						2048
							? args.slice(0).join(" ").replace(/\s/g, " 👏 ")
							: args
									.slice(0)
									.join(" ")
									.replace(/\s/g, " 👏 ")
									.substr(0, 2045) + "...",
				},
				message
			)
		);
	},
};
