const memefy = require("memefy");
module.exports = {
	name: "leet",
	category: "fun",
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "Please enter some text to convert" },
					message
				)
			);
		const leetText = memefy.leet(args.join(" "));
		const input = args.join(" ");
		return message.channel.send(
			client.embed(
				{
					fields: [
						{
							name: "Input",
							value: `\`\`\`${
								input.length >= 1018
									? input.slice(0, 1015) + "..."
									: input
							}\`\`\``,
						},
						{
							name: "Output",
							value: `\`\`\`${
								leetText.length >= 1018
									? leetText.slice(0, 1015) + "..."
									: leetText
							}\`\`\``,
						},
					],
				},
				message
			)
		);
	},
};
