module.exports = {
	name: "prefix",
	category: "moderation",
	userPermissions: ["ADMINISTRATOR"],
	run: async (client, message, args) => {
		if (!args.length || args[0].length >= 4)
			return message.channel.send(
				client.embed(
					{
						title:
							"Please enter a prefix and make sure it is less than 4 characters long!",
					},
					message
				)
			);
		const GuildConfigSchema = await client.db.load("guildconfig");
		const GuildConfig = await GuildConfigSchema.findOne({
			Guild: message.guild.id,
		});
		const oldPrefix = GuildConfig?.Prefix ?? "g?";
		await GuildConfigSchema.update(
			{ Guild: message.guild.id },
			{ Prefix: args[0].toLowerCase() }
		);
		return message.channel.send(
			client.embed(
				{
					title: "Prefix changed",
					fields: [
						{
							name: "Old",
							value: `\`\`\`${oldPrefix}\`\`\``,
						},
						{
							name: "New",
							value: `\`\`\`${args[0].toLowerCase()}\`\`\``,
						},
					],
				},
				message
			)
		);
	},
};
