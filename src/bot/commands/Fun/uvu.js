const owo = require("owoify-js").default;
module.exports = {
	name: "uvu",
	category: "fun",
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "Please enter some text to convert" },
					message
				)
			);
		const uvuText = owo(args.join(" "), "uvu");
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
								uvuText.length >= 1018
									? uvuText.slice(0, 1015) + "..."
									: uvuText
							}\`\`\``,
						},
					],
				},
				message
			)
		);
	},
};
