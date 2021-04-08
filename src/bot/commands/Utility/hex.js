module.exports = {
	name: "hex",
	category: "utility",
	run: async (client, message, args, prefix) => {
		if (!args.length || args.length < 2)
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Usage",
								value: `\`\`\`${prefix}hex <encode|decode> <value>\`\`\``,
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
								value: `\`\`\`${prefix}hex <encode|decode> <value>\`\`\``,
							},
						],
					},
					message
				)
			);

		let textIn = args.slice(1).join(" ");
		let converted = hex[args[0].toLowerCase()](textIn);
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

const hex = {
	encode: function encode(textOu) {
		let arr1 = [];
		for (var n = 0, l = textOu.length; n < l; n++) {
			var hex = Number(textOu.charCodeAt(n)).toString(16);
			arr1.push(hex);
		}

		return arr1.join("");
	},

	decode: function decode(textOu) {
		var hex = textOu.toString();
		var str = "";

		for (var n = 0; n < hex.length; n += 2) {
			str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
		}
		return str;
	},
};
