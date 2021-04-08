module.exports = {
	name: "leveling",
	category: "moderation",
	userPermissions: ["ADMINISTRATOR"],
	run: async (client, message, args, prefix) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Usage",
								value: `\`\`\`${prefix}leveling <on | off>\`\`\``,
							},
						],
					},
					message
				)
			);

		const options = ["on", "off"];
		if (options.indexOf(args[0].toLowerCase()) === -1)
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Usage",
								value: `\`\`\`${prefix}leveling <on | off>\`\`\``,
							},
						],
					},
					message
				)
			);
		const GuildConfigSchema = await client.db.load("guildconfig");
		const GuildConfig = await GuildConfigSchema.findOne({
			Guild: message.guild.id,
		});
		const currentStatus = GuildConfig?.Leveling ?? true;

		if (currentStatus && args[0].toLowerCase() === "on")
			return message.channel.send(
				client.embed(
					{
						title: "Leveling is already enabled!",
					},
					message
				)
			);
		if (!currentStatus && args[0].toLowerCase() === "off")
			return message.channel.send(
				client.embed(
					{
						title: "Leveling is already disabled!",
					},
					message
				)
			);

		await GuildConfigSchema.update(
			{ Guild: message.guild.id },
			{
				Leveling:
					args[0].toLowerCase() === "on"
						? true
						: args[0].toLowerCase() === "off"
						? false
						: true,
			}
		);

		return message.channel.send(
			client.embed(
				{
					title: `Successfully ${
						args[0].toLowerCase() === "on"
							? "enabled"
							: args[0].toLowerCase() === "off"
							? "disabled"
							: "enabled"
					} leveling!`,
				},
				message
			)
		);
	},
};
