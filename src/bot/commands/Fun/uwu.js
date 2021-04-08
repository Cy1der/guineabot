const owo = require("owoify-js").default;
module.exports = {
	name: "uwu",
	category: "fun",
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "Please enter some text to convert" },
					message
				)
			);
		const uwuText = owo(args.join(" "), "uwu");
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
								uwuText.length >= 1018
									? uwuText.slice(0, 1015) + "..."
									: uwuText
							}\`\`\``,
						},
					],
				},
				message
			)
		);
	},
};
