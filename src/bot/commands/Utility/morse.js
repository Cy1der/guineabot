const axios = require("axios").default;
const ms = require("ms");
module.exports = {
	name: "morse",
	category: "utility",
	cooldown: ms("30s"),
	run: async (client, message, args, prefix) => {
		if (!args.length || args.length < 2)
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Usage",
								value: `\`\`\`${prefix}morse <encode|decode> <value>\`\`\``,
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
								value: `\`\`\`${prefix}morse <encode|decode> <value>\`\`\``,
							},
						],
					},
					message
				)
			);

		let textIn = args.slice(1).join(" ");
		let converted = await morse[args[0].toLowerCase()](client, textIn);
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

const morse = {
	encode: async function decode(client, char) {
		var options = {
			url: `https://api.snowflakedev.xyz/api/morse/encode?text=${char}`,
			headers: {
				Authorization: client.config.bot.snowflake_api_key,
			},
		};

		const convertedText = await axios.request(options).then((res) => {
			return res.data.data;
		});
		return convertedText;
	},

	decode: async function decode(client, char) {
		var options = {
			url: `https://api.snowflakedev.xyz/api/morse/decode?text=${char}`,
			headers: {
				Authorization: client.config.bot.snowflake_api_key,
			},
		};

		const convertedText = await axios.request(options).then((res) => {
			return res.data.data;
		});
		return convertedText;
	},
};
