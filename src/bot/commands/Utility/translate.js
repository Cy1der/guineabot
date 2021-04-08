const translate = require("@k3rn31p4nic/google-translate-api");
const ms = require("ms");
module.exports = {
	name: "translate",
	category: "utility",
	cooldown: ms("5s"),
	run: async (client, message, args, prefix) => {
		if (!args.length || args.length < 3)
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Usage",
								value: `\`\`\`${prefix}translate <from> <to> <text>\`\`\``,
							},
						],
					},
					message
				)
			);
		let text = args.slice(2).join(" ");
		translate(text, {
			from: args[0].toLowerCase(),
			to: args[1].toLowerCase(),
		})
			.then(async (res) => {
				return await message.channel.send(
					client.embed(
						{
							fields: [
								{
									name: "Input",
									value: `\`\`\`${text}\`\`\``,
								},
								{
									name: "Output",
									value: `\`\`\`${res.text}\`\`\``,
								},
							],
						},
						message
					)
				);
			})
			.catch(async (err) => {
				return message.channel.send(
					client.embed(
						{
							title: "An error occurred!",
							fields: [
								{
									name: "Message",
									value: `\`${err.message}\``,
								},
							],
						},
						message
					)
				);
			});
	},
};
