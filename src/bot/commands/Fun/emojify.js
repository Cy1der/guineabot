module.exports = {
	name: "emojify",
	category: "fun",
	run: async (client, message, args) => {
		if (!args.length)
			return await message.channel.send(
				client.embed(
					{
						title: "Please add some text to parse into emoji!",
					},
					message
				)
			);

		const mapping = {
			" ": "   ",
			0: ":zero:",
			1: ":one:",
			2: ":two:",
			3: ":three:",
			4: ":four:",
			5: ":five:",
			6: ":six:",
			7: ":seven:",
			8: ":eight:",
			9: ":nine:",
			"!": ":grey_exclamation:",
			"?": ":grey_question:",
			"#": ":hash:",
			"*": ":asterisk:",
		};

		"abcdefghijklmnopqrstuvwxyz!?#*".split("").forEach((c) => {
			mapping[c] = mapping[
				c.toUpperCase()
			] = ` :regional_indicator_${c}:`;
		});

		const text = args
			.join(" ")
			.split("")
			.map((c) => mapping[c] || c)
			.join("");

		return await message.channel.send(
			client.embed(
				{
					description:
						text.length > 2048
							? text.substr(0, 2045) + "..."
							: text,
				},
				message
			)
		);
	},
};
