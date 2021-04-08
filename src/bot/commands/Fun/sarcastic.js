const memefy = require("memefy");
module.exports = {
	name: "sarcastic",
	category: "fun",
	aliases: ["sarc"],
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "Please enter some text to convert" },
					message
				)
			);
		const sarcasticText = memefy.alternating(args.join(" "));
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
								sarcasticText.length >= 1018
									? sarcasticText.slice(0, 1015) + "..."
									: sarcasticText
							}\`\`\``,
						},
					],
				},
				message
			)
		);
	},
};
