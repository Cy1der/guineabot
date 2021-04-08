module.exports = {
	name: "binary",
	category: "utility",
	run: async (client, message, args, prefix) => {
		if (!args.length || args.length < 2)
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Usage",
								value: `\`\`\`${prefix}binary <encode|decode> <value>\`\`\``,
							},
						],
					},
					message
				)
			);

		let choice = ["encode", "decode"];
		if (!choice.includes(args[0].toLowerCase()))
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Usage",
								value: `\`\`\`${prefix}binary <encode|decode> <value>\`\`\``,
							},
						],
					},
					message
				)
			);

		let textIn = args.slice(1).join(" ");
		let converted = binary[args[0].toLowerCase()](textIn);
		return await message.channel.send(
			client.embed(
				{
					fields: [
						{
							name: "Input",
							value: `\`\`\`${
								textIn.length >= 1018
									? textIn.slice(0, 1015) + "..."
									: textIn
							}\`\`\``,
						},
						{
							name: "Output",
							value: `\`\`\`${
								converted.length >= 1018
									? converted.slice(0, 1015) + "..."
									: converted
							}\`\`\``,
						},
					],
				},
				message
			)
		);
	},
};

const binary = {
	encode: function encode(char) {
		return char
			.split("")
			.map((str) => {
				const converted = str.charCodeAt(0).toString(2);
				return converted.padStart(8, "0");
			})
			.join(" ");
	},

	decode: function decode(char) {
		return char
			.split(" ")
			.map((str) => String.fromCharCode(Number.parseInt(str, 2)))
			.join("");
	},
};
